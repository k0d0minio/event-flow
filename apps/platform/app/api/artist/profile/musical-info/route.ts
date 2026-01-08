import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is an artist
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get artist record
    const { data: artist } = await supabase
      .from("artists")
      .select("*")
      .eq("profile_id", user.id)
      .single()

    if (!artist) {
      return NextResponse.json({
        success: true,
        data: {
          primary_genre: null,
          sub_genres: [],
          influences: [],
        },
      })
    }

    // Get genres and influences
    const { data: genres } = await supabase
      .from("artist_genres")
      .select("genre")
      .eq("artist_id", artist.id)

    const { data: influences } = await supabase
      .from("artist_influences")
      .select("influence")
      .eq("artist_id", artist.id)

    return NextResponse.json({
      success: true,
      data: {
        primary_genre: artist.primary_genre,
        sub_genres: genres?.map((g) => g.genre) || [],
        influences: influences?.map((i) => i.influence) || [],
      },
    })
  } catch (error) {
    console.error("Error fetching musical info:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is an artist
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { primary_genre, sub_genres, influences } = body

    // Validate sub_genres limit
    if (sub_genres && Array.isArray(sub_genres) && sub_genres.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 sub-genres allowed" },
        { status: 400 }
      )
    }

    // Get or create artist record
    const { data: existingArtist } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    let artistId: string

    if (existingArtist) {
      artistId = existingArtist.id
    } else {
      // Create new artist record if it doesn't exist
      const { data: newArtist, error: createError } = await supabase
        .from("artists")
        .insert({ profile_id: user.id })
        .select("id")
        .single()

      if (createError || !newArtist) {
        return NextResponse.json(
          { error: createError?.message || "Failed to create artist" },
          { status: 400 }
        )
      }
      artistId = newArtist.id
    }

    // Update primary_genre in artists table
    if (primary_genre !== undefined) {
      const { error: updateError } = await supabase
        .from("artists")
        .update({ primary_genre: primary_genre || null })
        .eq("id", artistId)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message || "Failed to update primary genre" },
          { status: 400 }
        )
      }
    }

    // Update sub_genres (artist_genres table)
    if (sub_genres !== undefined) {
      // Delete existing genres
      await supabase
        .from("artist_genres")
        .delete()
        .eq("artist_id", artistId)

      // Insert new genres if provided
      if (Array.isArray(sub_genres) && sub_genres.length > 0) {
        const genresToInsert = sub_genres
          .filter((g: unknown) => typeof g === "string" && g.trim() !== "")
          .map((genre: string) => ({
            artist_id: artistId,
            genre: genre.trim(),
          }))

        if (genresToInsert.length > 0) {
          const { error: genresError } = await supabase
            .from("artist_genres")
            .insert(genresToInsert)

          if (genresError) {
            return NextResponse.json(
              { error: genresError.message || "Failed to update genres" },
              { status: 400 }
            )
          }
        }
      }
    }

    // Update influences (artist_influences table)
    if (influences !== undefined) {
      // Delete existing influences
      await supabase
        .from("artist_influences")
        .delete()
        .eq("artist_id", artistId)

      // Insert new influences if provided
      if (Array.isArray(influences) && influences.length > 0) {
        const influencesToInsert = influences
          .filter((i: unknown) => typeof i === "string" && i.trim() !== "")
          .map((influence: string) => ({
            artist_id: artistId,
            influence: influence.trim(),
          }))

        if (influencesToInsert.length > 0) {
          const { error: influencesError } = await supabase
            .from("artist_influences")
            .insert(influencesToInsert)

          if (influencesError) {
            return NextResponse.json(
              { error: influencesError.message || "Failed to update influences" },
              { status: 400 }
            )
          }
        }
      }
    }

    // Fetch updated data
    const { data: updatedArtist } = await supabase
      .from("artists")
      .select("*")
      .eq("id", artistId)
      .single()

    const { data: genres } = await supabase
      .from("artist_genres")
      .select("genre")
      .eq("artist_id", artistId)

    const { data: influencesData } = await supabase
      .from("artist_influences")
      .select("influence")
      .eq("artist_id", artistId)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedArtist,
        sub_genres: genres?.map((g) => g.genre) || [],
        influences: influencesData?.map((i) => i.influence) || [],
      },
    })
  } catch (error) {
    console.error("Error updating musical info:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
