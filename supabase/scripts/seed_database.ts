#!/usr/bin/env tsx
/**
 * Script to seed the Supabase database with sample artists and venues
 * 
 * Usage (recommended):
 *   export $(cat apps/platform/.env.local | grep -E '^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_URL)=' | xargs)
 *   pnpm db:seed
 * 
 * Or manually:
 *   Option 1: Set environment variables directly
 *     SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> pnpm db:seed
 * 
 *   Option 2: One-liner
 *     export $(cat apps/platform/.env.local | grep -E '^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_URL)=' | xargs) && pnpm db:seed
 * 
 * The script will create:
 *   - 8 sample artists with complete profiles
 *   - 8 sample venues with complete profiles
 *   - Authenticated users for each (can log in)
 *   - Full artist_data and venue_data JSONB structures
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@ef/db/types'

// Try multiple environment variable names for flexibility
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗')
  console.error('\nMake sure to export environment variables from .env.local:')
  console.error('  export $(cat apps/platform/.env.local | grep -E "^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_URL)=" | xargs)')
  console.error('  pnpm db:seed')
  process.exit(1)
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Sample Artist Data
const SAMPLE_ARTISTS = [
  {
    email: 'luna.midnight@example.com',
    password: 'Artist2025!',
    display_name: 'Luna Midnight',
    bio: 'Electronic music producer and DJ specializing in deep house and techno.',
    genre: 'Electronic',
    artist_data: {
      stage_name: 'Luna Midnight',
      formation_type: 'solo',
      bio_short: 'Electronic music producer and DJ specializing in deep house and techno. Known for atmospheric soundscapes and driving beats.',
      bio_long: 'Luna Midnight is an electronic music producer and DJ who has been crafting immersive soundscapes for over 8 years. Based in Berlin, Luna combines deep house, techno, and ambient influences to create a unique sonic experience. Her sets are known for their emotional depth and technical precision, taking audiences on a journey through sound.',
      years_active: 8,
      professional_level: 'professional',
      primary_genre: 'Electronic',
      sub_genres: ['Deep House', 'Techno', 'Ambient'],
      influences: ['Aphex Twin', 'Nina Kraviz', 'Charlotte de Witte', 'Four Tet'],
    },
  },
  {
    email: 'the.velvet.notes@example.com',
    password: 'Artist2025!',
    display_name: 'The Velvet Notes',
    bio: 'Jazz quartet blending traditional jazz with modern influences.',
    genre: 'Jazz',
    artist_data: {
      stage_name: 'The Velvet Notes',
      formation_type: 'group',
      bio_short: 'Jazz quartet blending traditional jazz with modern influences. Smooth, sophisticated sound.',
      bio_long: 'The Velvet Notes is a dynamic jazz quartet that has been performing together for 5 years. Comprising piano, saxophone, double bass, and drums, the group brings a fresh perspective to classic jazz standards while incorporating elements of contemporary jazz and fusion. Their performances are characterized by tight arrangements, soulful improvisation, and an undeniable chemistry that captivates audiences.',
      years_active: 5,
      professional_level: 'semi-pro',
      primary_genre: 'Jazz',
      sub_genres: ['Modern Jazz', 'Smooth Jazz', 'Fusion'],
      influences: ['Miles Davis', 'Herbie Hancock', 'Kamasi Washington', 'Snarky Puppy'],
    },
  },
  {
    email: 'rivers.edge@example.com',
    password: 'Artist2025!',
    display_name: 'Rivers Edge',
    bio: 'Indie folk duo with haunting harmonies and acoustic instrumentation.',
    genre: 'Folk',
    artist_data: {
      stage_name: 'Rivers Edge',
      formation_type: 'duo',
      bio_short: 'Indie folk duo with haunting harmonies and acoustic instrumentation. Intimate and emotive performances.',
      bio_long: 'Rivers Edge is an indie folk duo consisting of two singer-songwriters who met at a small open mic night in Portland. Their music combines intricate fingerpicking guitar work with ethereal vocal harmonies, creating an intimate and emotionally resonant sound. Drawing inspiration from artists like Fleet Foxes and The Civil Wars, Rivers Edge crafts songs that feel both timeless and contemporary.',
      years_active: 3,
      professional_level: 'semi-pro',
      primary_genre: 'Folk',
      sub_genres: ['Indie Folk', 'Acoustic', 'Singer-Songwriter'],
      influences: ['Fleet Foxes', 'The Civil Wars', 'Bon Iver', 'Iron & Wine'],
    },
  },
  {
    email: 'neon.dreams@example.com',
    password: 'Artist2025!',
    display_name: 'Neon Dreams',
    bio: 'Synth-pop band with 80s influences and modern production.',
    genre: 'Pop',
    artist_data: {
      stage_name: 'Neon Dreams',
      formation_type: 'group',
      bio_short: 'Synth-pop band with 80s influences and modern production. High-energy live shows.',
      bio_long: 'Neon Dreams is a synth-pop band that channels the spirit of 1980s new wave while infusing it with contemporary production techniques. The five-piece band features synthesizers, electric guitars, and powerful vocals, creating an infectious sound that gets audiences moving. With influences ranging from Duran Duran to The Weeknd, Neon Dreams delivers polished pop songs with an edge.',
      years_active: 4,
      professional_level: 'professional',
      primary_genre: 'Pop',
      sub_genres: ['Synth-Pop', 'New Wave', 'Indie Pop'],
      influences: ['Duran Duran', 'The Weeknd', 'MGMT', 'Tame Impala'],
    },
  },
  {
    email: 'thunder.bolt@example.com',
    password: 'Artist2025!',
    display_name: 'Thunder Bolt',
    bio: 'High-energy rock band with powerful riffs and anthemic choruses.',
    genre: 'Rock',
    artist_data: {
      stage_name: 'Thunder Bolt',
      formation_type: 'group',
      bio_short: 'High-energy rock band with powerful riffs and anthemic choruses. Explosive live performances.',
      bio_long: 'Thunder Bolt is a four-piece rock band that brings raw energy and powerful performances to every stage. Formed in 2019, the band has built a reputation for their explosive live shows, combining hard-hitting drums, driving bass lines, searing guitar solos, and commanding vocals. Their sound draws from classic rock, alternative rock, and punk influences, creating music that is both nostalgic and fresh.',
      years_active: 6,
      professional_level: 'professional',
      primary_genre: 'Rock',
      sub_genres: ['Alternative Rock', 'Hard Rock', 'Punk Rock'],
      influences: ['Foo Fighters', 'The Black Keys', 'Arctic Monkeys', 'Green Day'],
    },
  },
  {
    email: 'soul.spark@example.com',
    password: 'Artist2025!',
    display_name: 'Soul Spark',
    bio: 'Soul and R&B singer with powerful vocals and emotional depth.',
    genre: 'R&B',
    artist_data: {
      stage_name: 'Soul Spark',
      formation_type: 'solo',
      bio_short: 'Soul and R&B singer with powerful vocals and emotional depth. Captivating stage presence.',
      bio_long: 'Soul Spark is a rising R&B and soul artist known for her powerful, emotive vocals and authentic songwriting. With a voice that can move from tender whispers to soaring belted notes, she brings raw emotion to every performance. Her music explores themes of love, loss, empowerment, and self-discovery, resonating with audiences who appreciate genuine, heartfelt artistry.',
      years_active: 2,
      professional_level: 'semi-pro',
      primary_genre: 'R&B',
      sub_genres: ['Soul', 'Contemporary R&B', 'Neo-Soul'],
      influences: ['Alicia Keys', 'Erykah Badu', 'H.E.R.', 'D\'Angelo'],
    },
  },
  {
    email: 'midnight.raiders@example.com',
    password: 'Artist2025!',
    display_name: 'Midnight Raiders',
    bio: 'Hip-hop collective with conscious lyrics and boom-bap beats.',
    genre: 'Hip-Hop',
    artist_data: {
      stage_name: 'Midnight Raiders',
      formation_type: 'group',
      bio_short: 'Hip-hop collective with conscious lyrics and boom-bap beats. Thought-provoking and energetic.',
      bio_long: 'Midnight Raiders is a hip-hop collective that combines sharp lyricism with classic boom-bap production. The group consists of three MCs and a DJ, each bringing their unique perspective and flow. Their music addresses social issues, personal struggles, and triumphs, delivered with technical skill and genuine passion. Drawing inspiration from golden age hip-hop while maintaining a contemporary edge.',
      years_active: 7,
      professional_level: 'professional',
      primary_genre: 'Hip-Hop',
      sub_genres: ['Boom Bap', 'Conscious Hip-Hop', 'East Coast Hip-Hop'],
      influences: ['A Tribe Called Quest', 'Wu-Tang Clan', 'Kendrick Lamar', 'J. Cole'],
    },
  },
  {
    email: 'acoustic.wanderer@example.com',
    password: 'Artist2025!',
    display_name: 'Acoustic Wanderer',
    bio: 'Solo acoustic guitarist and singer-songwriter with fingerstyle mastery.',
    genre: 'Folk',
    artist_data: {
      stage_name: 'Acoustic Wanderer',
      formation_type: 'solo',
      bio_short: 'Solo acoustic guitarist and singer-songwriter with fingerstyle mastery. Intimate storytelling.',
      bio_long: 'Acoustic Wanderer is a solo artist who has been traveling and performing for over 10 years, bringing music to intimate venues and festivals across the country. Known for intricate fingerstyle guitar work and thoughtful songwriting, each performance feels like a personal conversation. The music draws from folk, blues, and country traditions, creating a sound that feels both familiar and uniquely personal.',
      years_active: 10,
      professional_level: 'professional',
      primary_genre: 'Folk',
      sub_genres: ['Acoustic', 'Singer-Songwriter', 'Americana'],
      influences: ['John Mayer', 'Ed Sheeran', 'James Taylor', 'Tommy Emmanuel'],
    },
  },
]

// Sample Venue Data
const SAMPLE_VENUES = [
  {
    email: 'blue.note.club@example.com',
    password: 'Venue2025!',
    name: 'Blue Note Club',
    address: '123 Music Street, Paris, France',
    capacity: 200,
    venue_data: {
      venue_name: 'Blue Note Club',
      commercial_name: 'Blue Note Paris',
      venue_type: 'club',
      capacity: {
        min: 150,
        max: 200,
        configurations: ['Standing', 'Seated', 'Mixed'],
      },
      location: {
        address: '123 Music Street, 75001 Paris, France',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        public_transport: ['Metro: Line 1 - Châtelet', 'Bus: 21, 38, 47'],
        parking: 'Limited street parking available',
        pmr_access: true,
      },
      history: 'Established in 2015, Blue Note Club has become one of Paris\' premier destinations for live music. The venue has hosted hundreds of artists across genres, from jazz to electronic to indie rock.',
      ambiance: ['Intimate', 'Underground', 'Artistic', 'Vibrant'],
      technical_equipment: {
        sound_system: 'Professional PA system with 8-channel mixing board, monitors, and subwoofers',
        lighting: 'LED stage lighting with color mixing and DMX control',
        stage: 'Raised stage 12x8 feet with backline equipment available',
        control_room: 'Sound booth with full mixing capabilities',
        artist_spaces: 'Green room with mirrors, seating, and refreshments',
      },
      programming: {
        preferred_genres: ['Jazz', 'Electronic', 'Indie Rock', 'Soul'],
        excluded_genres: [],
        event_frequency: '4-5 nights per week',
        preferred_schedule: 'Evening shows (8 PM - 2 AM)',
        budget_range: '€500 - €2000 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Bar snacks and drinks available',
        },
        ticketing: 'Online and door sales',
      },
    },
  },
  {
    email: 'grand.theater@example.com',
    password: 'Venue2025!',
    name: 'Grand Theater',
    address: '456 Avenue des Arts, Lyon, France',
    capacity: 800,
    venue_data: {
      venue_name: 'Grand Theater',
      commercial_name: 'Théâtre Grand Lyon',
      venue_type: 'theater',
      capacity: {
        min: 600,
        max: 800,
        configurations: ['Orchestra seating', 'Balcony', 'Full capacity'],
      },
      location: {
        address: '456 Avenue des Arts, 69001 Lyon, France',
        coordinates: { lat: 45.7640, lng: 4.8357 },
        public_transport: ['Metro: Line A - Hôtel de Ville', 'Tram: T1, T2'],
        parking: 'Parking garage nearby (200 spaces)',
        pmr_access: true,
      },
      history: 'Built in 1920, the Grand Theater has been a cultural landmark in Lyon for over a century. The venue underwent major renovations in 2010, combining historic architecture with modern technical capabilities.',
      ambiance: ['Elegant', 'Historic', 'Sophisticated', 'Grand'],
      technical_equipment: {
        sound_system: 'Concert hall sound system with 32-channel digital mixing console',
        lighting: 'Full theatrical lighting rig with moving lights and color washes',
        stage: 'Proscenium stage 20x15 meters with orchestra pit',
        control_room: 'Professional control booth with sound and lighting',
        artist_spaces: 'Multiple dressing rooms, green room, and artist lounge',
      },
      programming: {
        preferred_genres: ['Classical', 'Jazz', 'World Music', 'Theater'],
        excluded_genres: ['Heavy Metal', 'Hardcore'],
        event_frequency: '3-4 shows per week',
        preferred_schedule: 'Evening performances (7 PM - 11 PM)',
        budget_range: '€2000 - €8000 per show',
      },
      services: {
        accommodation: {
          available: true,
          capacity: 4,
        },
        catering: {
          available: true,
          type: 'Full catering service available',
        },
        ticketing: 'Box office and online sales',
      },
    },
  },
  {
    email: 'underground.bar@example.com',
    password: 'Venue2025!',
    name: 'Underground Bar',
    address: '789 Rue de la Nuit, Marseille, France',
    capacity: 100,
    venue_data: {
      venue_name: 'Underground Bar',
      commercial_name: 'Underground Marseille',
      venue_type: 'bar',
      capacity: {
        min: 50,
        max: 100,
        configurations: ['Standing', 'Mixed'],
      },
      location: {
        address: '789 Rue de la Nuit, 13001 Marseille, France',
        coordinates: { lat: 43.2965, lng: 5.3698 },
        public_transport: ['Metro: Line 1 - Vieux-Port', 'Bus: 60, 61'],
        parking: 'Street parking available',
        pmr_access: false,
      },
      history: 'A cozy underground bar that has been supporting local music since 2018. Known for its intimate atmosphere and diverse programming.',
      ambiance: ['Intimate', 'Casual', 'Underground', 'Local'],
      technical_equipment: {
        sound_system: 'Compact PA system suitable for acoustic and small band performances',
        lighting: 'Basic stage lighting',
        stage: 'Small raised platform 6x4 feet',
        control_room: 'Simple mixing setup',
        artist_spaces: 'Small back area for artists',
      },
      programming: {
        preferred_genres: ['Acoustic', 'Folk', 'Indie', 'Jazz'],
        excluded_genres: ['Heavy Metal', 'Electronic Dance'],
        event_frequency: '2-3 nights per week',
        preferred_schedule: 'Evening shows (8 PM - 12 AM)',
        budget_range: '€200 - €800 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Bar menu and drinks',
        },
        ticketing: 'Door sales only',
      },
    },
  },
  {
    email: 'summer.festival@example.com',
    password: 'Venue2025!',
    name: 'Summer Festival Grounds',
    address: 'Festival Park, Nice, France',
    capacity: 5000,
    venue_data: {
      venue_name: 'Summer Festival Grounds',
      commercial_name: 'Nice Summer Music Festival',
      venue_type: 'festival',
      capacity: {
        min: 3000,
        max: 5000,
        configurations: ['Open field', 'Staged areas', 'VIP section'],
      },
      location: {
        address: 'Festival Park, 06000 Nice, France',
        coordinates: { lat: 43.7102, lng: 7.2620 },
        public_transport: ['Bus: 12, 23, 30', 'Shuttle service available'],
        parking: 'Large parking area (500 spaces)',
        pmr_access: true,
      },
      history: 'Annual summer music festival established in 2010. Features multiple stages, food vendors, and camping facilities.',
      ambiance: ['Festive', 'Outdoor', 'Energetic', 'Community'],
      technical_equipment: {
        sound_system: 'Large-scale festival PA system with multiple speaker arrays',
        lighting: 'Full festival lighting rig with lasers and effects',
        stage: 'Multiple stages: Main stage 20x15m, Secondary stage 12x8m',
        control_room: 'Professional mobile control units',
        artist_spaces: 'Artist village with multiple trailers and facilities',
      },
      programming: {
        preferred_genres: ['Rock', 'Pop', 'Electronic', 'Indie', 'Hip-Hop'],
        excluded_genres: [],
        event_frequency: 'Annual festival (3-day event)',
        preferred_schedule: 'Afternoon and evening performances',
        budget_range: '€5000 - €50000 per event',
      },
      services: {
        accommodation: {
          available: true,
          capacity: 50,
        },
        catering: {
          available: true,
          type: 'Multiple food vendors and bars',
        },
        ticketing: 'Online sales and box office',
      },
    },
  },
  {
    email: 'jazz.cellar@example.com',
    password: 'Venue2025!',
    name: 'Jazz Cellar',
    address: '321 Basement Lane, Bordeaux, France',
    capacity: 80,
    venue_data: {
      venue_name: 'Jazz Cellar',
      commercial_name: 'Le Caveau du Jazz',
      venue_type: 'club',
      capacity: {
        min: 50,
        max: 80,
        configurations: ['Intimate seating', 'Standing'],
      },
      location: {
        address: '321 Basement Lane, 33000 Bordeaux, France',
        coordinates: { lat: 44.8378, lng: -0.5792 },
        public_transport: ['Tram: Line A - Hôtel de Ville', 'Bus: 1, 4, 15'],
        parking: 'Limited parking nearby',
        pmr_access: false,
      },
      history: 'A hidden gem in Bordeaux\'s music scene, the Jazz Cellar has been hosting intimate jazz performances since 2012. The basement location creates a unique acoustic environment.',
      ambiance: ['Intimate', 'Underground', 'Sophisticated', 'Warm'],
      technical_equipment: {
        sound_system: 'Acoustic-focused sound system for jazz performances',
        lighting: 'Warm ambient lighting',
        stage: 'Small stage area 8x6 feet',
        control_room: 'Simple mixing setup',
        artist_spaces: 'Small back area',
      },
      programming: {
        preferred_genres: ['Jazz', 'Blues', 'Soul', 'Acoustic'],
        excluded_genres: ['Electronic', 'Heavy Rock'],
        event_frequency: '5-6 nights per week',
        preferred_schedule: 'Evening shows (7 PM - 11 PM)',
        budget_range: '€300 - €1200 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Wine bar with light snacks',
        },
        ticketing: 'Door sales and reservations',
      },
    },
  },
  {
    email: 'rock.hall@example.com',
    password: 'Venue2025!',
    name: 'Rock Hall',
    address: '555 Electric Avenue, Toulouse, France',
    capacity: 500,
    venue_data: {
      venue_name: 'Rock Hall',
      commercial_name: 'Rock Hall Toulouse',
      venue_type: 'concert_hall',
      capacity: {
        min: 300,
        max: 500,
        configurations: ['Standing', 'Mixed', 'Full capacity'],
      },
      location: {
        address: '555 Electric Avenue, 31000 Toulouse, France',
        coordinates: { lat: 43.6047, lng: 1.4442 },
        public_transport: ['Metro: Line A - Jean Jaurès', 'Bus: 14, 22'],
        parking: 'Parking available nearby',
        pmr_access: true,
      },
      history: 'Established in 2016, Rock Hall has become Toulouse\'s premier venue for rock, metal, and alternative music. Known for its excellent sound system and energetic atmosphere.',
      ambiance: ['Energetic', 'Loud', 'Underground', 'Rebellious'],
      technical_equipment: {
        sound_system: 'High-powered PA system designed for rock music with 16-channel mixing',
        lighting: 'Dynamic lighting rig with strobes and color effects',
        stage: 'Large stage 15x10 feet with full backline',
        control_room: 'Professional sound and lighting control',
        artist_spaces: 'Green room and dressing areas',
      },
      programming: {
        preferred_genres: ['Rock', 'Metal', 'Alternative', 'Punk', 'Indie Rock'],
        excluded_genres: ['Classical', 'Jazz'],
        event_frequency: '4-5 nights per week',
        preferred_schedule: 'Evening shows (8 PM - 1 AM)',
        budget_range: '€800 - €3000 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Bar with food options',
        },
        ticketing: 'Online and door sales',
      },
    },
  },
  {
    email: 'riverside.outdoor@example.com',
    password: 'Venue2025!',
    name: 'Riverside Outdoor Stage',
    address: 'Riverside Park, Strasbourg, France',
    capacity: 1500,
    venue_data: {
      venue_name: 'Riverside Outdoor Stage',
      commercial_name: 'Scène Fluviale Strasbourg',
      venue_type: 'outdoor',
      capacity: {
        min: 800,
        max: 1500,
        configurations: ['Open field', 'Seated area', 'VIP section'],
      },
      location: {
        address: 'Riverside Park, 67000 Strasbourg, France',
        coordinates: { lat: 48.5734, lng: 7.7521 },
        public_transport: ['Tram: Line A, B, C - Homme de Fer', 'Bus: 10, 30'],
        parking: 'Parking area available (300 spaces)',
        pmr_access: true,
      },
      history: 'An outdoor stage located along the river, hosting concerts and events during the summer months. The natural setting provides a unique backdrop for performances.',
      ambiance: ['Outdoor', 'Natural', 'Relaxed', 'Festive'],
      technical_equipment: {
        sound_system: 'Outdoor PA system suitable for large audiences',
        lighting: 'Stage lighting for evening performances',
        stage: 'Large outdoor stage 18x12 meters',
        control_room: 'Mobile control unit',
        artist_spaces: 'Temporary artist facilities',
      },
      programming: {
        preferred_genres: ['Folk', 'Indie', 'Pop', 'World Music', 'Acoustic'],
        excluded_genres: ['Heavy Metal'],
        event_frequency: 'Seasonal (May - September, weekends)',
        preferred_schedule: 'Afternoon and evening shows',
        budget_range: '€1500 - €6000 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Food trucks and beverage vendors',
        },
        ticketing: 'Online and gate sales',
      },
    },
  },
  {
    email: 'soul.kitchen@example.com',
    password: 'Venue2025!',
    name: 'Soul Kitchen',
    address: '888 Soul Street, Nantes, France',
    capacity: 150,
    venue_data: {
      venue_name: 'Soul Kitchen',
      commercial_name: 'Soul Kitchen Nantes',
      venue_type: 'bar',
      capacity: {
        min: 100,
        max: 150,
        configurations: ['Standing', 'Mixed'],
      },
      location: {
        address: '888 Soul Street, 44000 Nantes, France',
        coordinates: { lat: 47.2184, lng: -1.5536 },
        public_transport: ['Tram: Line 1, 2, 3 - Commerce', 'Bus: 11, 12'],
        parking: 'Street parking available',
        pmr_access: true,
      },
      history: 'A vibrant bar and music venue that combines great food with live music. Established in 2019, Soul Kitchen has become a favorite spot for both locals and touring artists.',
      ambiance: ['Vibrant', 'Welcoming', 'Energetic', 'Community'],
      technical_equipment: {
        sound_system: 'Quality PA system for live music',
        lighting: 'Stage lighting with color options',
        stage: 'Raised stage 10x6 feet',
        control_room: 'Mixing setup',
        artist_spaces: 'Back area for artists',
      },
      programming: {
        preferred_genres: ['Soul', 'R&B', 'Funk', 'Jazz', 'Blues'],
        excluded_genres: ['Heavy Metal', 'Hardcore'],
        event_frequency: '3-4 nights per week',
        preferred_schedule: 'Evening shows (8 PM - 12 AM)',
        budget_range: '€400 - €1500 per show',
      },
      services: {
        accommodation: {
          available: false,
        },
        catering: {
          available: true,
          type: 'Full restaurant menu and bar',
        },
        ticketing: 'Door sales and reservations',
      },
    },
  },
]

async function seedDatabase() {
  console.log('Starting database seeding...\n')
  console.log(`Creating ${SAMPLE_ARTISTS.length} artists and ${SAMPLE_VENUES.length} venues\n`)

  // Seed Artists
  console.log('=== SEEDING ARTISTS ===\n')
  for (const artist of SAMPLE_ARTISTS) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === artist.email)

      let userId: string

      if (existingUser) {
        console.log(`User ${artist.email} already exists. Updating profile...`)
        userId = existingUser.id
      } else {
        // Create new user
        console.log(`Creating user ${artist.email}...`)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: artist.email,
          password: artist.password,
          email_confirm: true,
        })

        if (createError) {
          console.error(`Error creating user ${artist.email}:`, createError.message)
          continue
        }

        if (!newUser.user) {
          console.error(`Error: User object not returned for ${artist.email}`)
          continue
        }

        userId = newUser.user.id
        console.log(`✓ User created: ${artist.email} (ID: ${userId})`)
      }

      // Create/update profile with artist role and artist_data
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId,
            role: 'artist',
            artist_data: artist.artist_data,
          },
          {
            onConflict: 'id',
          }
        )

      if (profileError) {
        console.error(`Error creating/updating profile for ${artist.email}:`, profileError.message)
        continue
      }
      console.log(`✓ Profile created/updated for ${artist.email}`)

      // Check for old-format record (where id = userId, old schema)
      // Old schema: artists.id = profile_id (user ID)
      // New schema: artists.id = UUID, artists.profile_id = user ID
      const { data: oldFormatRecord } = await supabaseAdmin
        .from('artists')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      // Migrate old-format record if it exists and doesn't have profile_id set correctly
      // Check: if record exists with id = userId AND (no profile_id OR profile_id = id)
      if (oldFormatRecord) {
        const hasProfileId = 'profile_id' in oldFormatRecord && oldFormatRecord.profile_id !== null && oldFormatRecord.profile_id !== undefined
        const profileIdMatchesId = hasProfileId && oldFormatRecord.profile_id === oldFormatRecord.id
        
        if (!hasProfileId || profileIdMatchesId) {
        console.log(`⚠ Found old-format record for ${artist.email}, migrating...`)
        
        // Extract old data
        const oldData = oldFormatRecord as any
        
        // Create new record with proper structure
        // Use REST API directly to bypass PostgREST schema cache
        // Note: Omitting bio_long temporarily due to PostgREST schema cache issue
        const insertData: Record<string, unknown> = {
          profile_id: userId,
          stage_name: oldData.display_name || artist.artist_data.stage_name || null,
          formation_type: artist.artist_data.formation_type || null,
          bio_short: oldData.bio ? (oldData.bio.length > 500 ? oldData.bio.substring(0, 500) : oldData.bio) : (artist.artist_data.bio_short || null),
          years_active: artist.artist_data.years_active || null,
          professional_level: artist.artist_data.professional_level || null,
          primary_genre: oldData.genre || artist.artist_data.primary_genre || null,
        }

        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/artists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(insertData),
        })

        if (!insertResponse.ok) {
          const errorText = await insertResponse.text()
          console.error(`Error migrating old record for ${artist.email}:`, errorText)
        } else {
          const migratedArtist = await insertResponse.json()
          const artistId = Array.isArray(migratedArtist) ? migratedArtist[0]?.id : migratedArtist?.id

          if (artistId) {
            // Delete old record
            await supabaseAdmin
              .from('artists')
              .delete()
              .eq('id', userId)
            
            console.log(`✓ Migrated old record to new structure for ${artist.email}`)
          } else {
            console.error(`Error: Could not get artist ID from migrated record for ${artist.email}`)
          }
        }
      } else {
        // Record already in new format, skip migration
        console.log(`✓ Record already in new format for ${artist.email}`)
      }
      }

      // Get or create artist record with correct schema
      const { data: existingArtist } = await supabaseAdmin
        .from('artists')
        .select('id')
        .eq('profile_id', userId)
        .single()

      let artistId: string

      if (existingArtist) {
        artistId = existingArtist.id
        // Update existing artist record using REST API to bypass schema cache
        // Note: Omitting bio_long temporarily due to PostgREST schema cache issue
        const updateData: Record<string, unknown> = {
          stage_name: artist.artist_data.stage_name || null,
          formation_type: artist.artist_data.formation_type || null,
          bio_short: artist.artist_data.bio_short || null,
          years_active: artist.artist_data.years_active || null,
          professional_level: artist.artist_data.professional_level || null,
          primary_genre: artist.artist_data.primary_genre || null,
        }

        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/artists?id=eq.${artistId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify(updateData),
        })

        const artistError = updateResponse.ok ? null : { message: await updateResponse.text() }

        if (artistError) {
          console.error(`Error updating artist record for ${artist.email}:`, artistError.message)
          continue
        }
      } else {
        // Create new artist record using REST API to bypass schema cache
        // Note: Omitting bio_long temporarily due to PostgREST schema cache issue
        const newArtistData: Record<string, unknown> = {
          profile_id: userId,
          stage_name: artist.artist_data.stage_name || null,
          formation_type: artist.artist_data.formation_type || null,
          bio_short: artist.artist_data.bio_short || null,
          years_active: artist.artist_data.years_active || null,
          professional_level: artist.artist_data.professional_level || null,
          primary_genre: artist.artist_data.primary_genre || null,
        }

        const newArtistResponse = await fetch(`${SUPABASE_URL}/rest/v1/artists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(newArtistData),
        })

        if (!newArtistResponse.ok) {
          const errorText = await newArtistResponse.text()
          console.error(`Error creating artist record for ${artist.email}:`, errorText)
          continue
        }

        const newArtistResult = await newArtistResponse.json()
        const newArtist = Array.isArray(newArtistResult) ? newArtistResult[0] : newArtistResult
        const artistError = newArtist?.id ? null : { message: 'Failed to get artist ID from response' }

        if (artistError || !newArtist?.id) {
          console.error(`Error creating artist record for ${artist.email}:`, artistError?.message)
          continue
        }
        artistId = newArtist.id
      }

      console.log(`✓ Artist record created/updated for ${artist.artist_data.stage_name}`)

      // Populate artist_genres table
      if (artist.artist_data.sub_genres && Array.isArray(artist.artist_data.sub_genres)) {
        // Delete existing genres
        await supabaseAdmin
          .from('artist_genres')
          .delete()
          .eq('artist_id', artistId)

        // Insert new genres
        if (artist.artist_data.sub_genres.length > 0) {
          const genresToInsert = artist.artist_data.sub_genres
            .filter((g: unknown) => typeof g === 'string' && g.trim() !== '')
            .map((genre: string) => ({
              artist_id: artistId,
              genre: genre.trim(),
            }))

          if (genresToInsert.length > 0) {
            const { error: genresError } = await supabaseAdmin
              .from('artist_genres')
              .insert(genresToInsert)

            if (genresError) {
              console.error(`Error inserting genres for ${artist.email}:`, genresError.message)
            } else {
              console.log(`✓ Inserted ${genresToInsert.length} genres`)
            }
          }
        }
      }

      // Populate artist_influences table
      if (artist.artist_data.influences && Array.isArray(artist.artist_data.influences)) {
        // Delete existing influences
        await supabaseAdmin
          .from('artist_influences')
          .delete()
          .eq('artist_id', artistId)

        // Insert new influences
        if (artist.artist_data.influences.length > 0) {
          const influencesToInsert = artist.artist_data.influences
            .filter((i: unknown) => typeof i === 'string' && i.trim() !== '')
            .map((influence: string) => ({
              artist_id: artistId,
              influence: influence.trim(),
            }))

          if (influencesToInsert.length > 0) {
            const { error: influencesError } = await supabaseAdmin
              .from('artist_influences')
              .insert(influencesToInsert)

            if (influencesError) {
              console.error(`Error inserting influences for ${artist.email}:`, influencesError.message)
            } else {
              console.log(`✓ Inserted ${influencesToInsert.length} influences`)
            }
          }
        }
      }
    } catch (error) {
      console.error(`Unexpected error for ${artist.email}:`, error)
    }
    console.log('')
  }

  // Seed Venues
  console.log('=== SEEDING VENUES ===\n')
  for (const venue of SAMPLE_VENUES) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === venue.email)

      let userId: string

      if (existingUser) {
        console.log(`User ${venue.email} already exists. Updating profile...`)
        userId = existingUser.id
      } else {
        // Create new user
        console.log(`Creating user ${venue.email}...`)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: venue.email,
          password: venue.password,
          email_confirm: true,
        })

        if (createError) {
          console.error(`Error creating user ${venue.email}:`, createError.message)
          continue
        }

        if (!newUser.user) {
          console.error(`Error: User object not returned for ${venue.email}`)
          continue
        }

        userId = newUser.user.id
        console.log(`✓ User created: ${venue.email} (ID: ${userId})`)
      }

      // Create/update profile with venue role and venue_data
      // First ensure profile exists with correct role
      const { error: profileRoleError } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId,
            role: 'venue',
          },
          {
            onConflict: 'id',
          }
        )

      if (profileRoleError) {
        console.error(`Error creating/updating profile role for ${venue.email}:`, profileRoleError.message)
        continue
      }

      // Then update venue_data separately
      // Note: If this fails with "schema cache" error, ensure migrations have been run:
      //   supabase migration up
      const { error: venueDataError } = await supabaseAdmin
        .from('profiles')
        .update({ venue_data: venue.venue_data })
        .eq('id', userId)

      if (venueDataError) {
        if (venueDataError.message.includes('schema cache') || venueDataError.message.includes('venue_data')) {
          console.warn(`⚠ Warning: Could not update venue_data for ${venue.email}`)
          console.warn(`  This is likely a schema cache issue. The venue profile and record were created successfully.`)
          console.warn(`  To fix: Ensure migration 20251127214959_add_venue_profile_data.sql has been applied.`)
          console.warn(`  You can update venue_data manually via Supabase dashboard or re-run after migrations.`)
        } else {
          console.error(`Error updating venue_data for ${venue.email}:`, venueDataError.message)
        }
        // Continue - profile and venue record were created
        console.log(`✓ Venue record created/updated for ${venue.name} (venue_data update skipped)`)
      } else {
        console.log(`✓ Profile created/updated for ${venue.email}`)
      }

      // Check for old-format record (where id = userId, old schema)
      // Old schema: venues.id = profile_id (user ID)
      // New schema: venues.id = UUID, venues.profile_id = user ID
      const { data: oldFormatVenue } = await supabaseAdmin
        .from('venues')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      // Migrate old-format record if it exists and doesn't have profile_id set correctly
      if (oldFormatVenue) {
        const hasProfileId = 'profile_id' in oldFormatVenue && oldFormatVenue.profile_id !== null && oldFormatVenue.profile_id !== undefined
        const profileIdMatchesId = hasProfileId && oldFormatVenue.profile_id === oldFormatVenue.id
        
        if (!hasProfileId || profileIdMatchesId) {
        console.log(`⚠ Found old-format venue record for ${venue.email}, migrating...`)
        
        // Extract old data
        const oldVenueData = oldFormatVenue as any
        
        // Create new record with proper structure using REST API to bypass schema cache
        // Note: Omitting ambiance temporarily due to PostgREST schema cache issue
        const venueInsertData: Record<string, unknown> = {
          profile_id: userId,
          venue_name: oldVenueData.name || venue.venue_data.venue_name || null,
          commercial_name: venue.venue_data.commercial_name || null,
          venue_type: venue.venue_data.venue_type || null,
          capacity_min: venue.venue_data.capacity?.min || oldVenueData.capacity || null,
          capacity_max: venue.venue_data.capacity?.max || oldVenueData.capacity || null,
          history: venue.venue_data.history || null,
        }

        const venueInsertResponse = await fetch(`${SUPABASE_URL}/rest/v1/venues`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(venueInsertData),
        })

        if (!venueInsertResponse.ok) {
          const errorText = await venueInsertResponse.text()
          console.error(`Error migrating old venue record for ${venue.email}:`, errorText)
        } else {
          const migratedVenue = await venueInsertResponse.json()
          const venueId = Array.isArray(migratedVenue) ? migratedVenue[0]?.id : migratedVenue?.id

          if (venueId) {
            // Delete old record
            await supabaseAdmin
              .from('venues')
              .delete()
              .eq('id', userId)
            
            console.log(`✓ Migrated old venue record to new structure for ${venue.email}`)
          } else {
            console.error(`Error: Could not get venue ID from migrated record for ${venue.email}`)
          }
        }
        } else {
          // Record already in new format, skip migration
          console.log(`✓ Venue record already in new format for ${venue.email}`)
        }
      }

      // Get or create venue record with correct schema
      const { data: existingVenue } = await supabaseAdmin
        .from('venues')
        .select('id')
        .eq('profile_id', userId)
        .single()

      let venueId: string

      if (existingVenue) {
        venueId = existingVenue.id
        // Update existing venue record using REST API to bypass schema cache
        // Note: Omitting ambiance temporarily due to PostgREST schema cache issue
        const venueUpdateData: Record<string, unknown> = {
          venue_name: venue.venue_data.venue_name || null,
          commercial_name: venue.venue_data.commercial_name || null,
          venue_type: venue.venue_data.venue_type || null,
          capacity_min: venue.venue_data.capacity?.min || null,
          capacity_max: venue.venue_data.capacity?.max || null,
          history: venue.venue_data.history || null,
        }

        const venueUpdateResponse = await fetch(`${SUPABASE_URL}/rest/v1/venues?id=eq.${venueId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify(venueUpdateData),
        })

        const venueError = venueUpdateResponse.ok ? null : { message: await venueUpdateResponse.text() }

        if (venueError) {
          console.error(`Error updating venue record for ${venue.email}:`, venueError.message)
          continue
        }
      } else {
        // Create new venue record using REST API to bypass schema cache
        // Note: Omitting ambiance temporarily due to PostgREST schema cache issue
        const newVenueData: Record<string, unknown> = {
          profile_id: userId,
          venue_name: venue.venue_data.venue_name || null,
          commercial_name: venue.venue_data.commercial_name || null,
          venue_type: venue.venue_data.venue_type || null,
          capacity_min: venue.venue_data.capacity?.min || null,
          capacity_max: venue.venue_data.capacity?.max || null,
          history: venue.venue_data.history || null,
        }

        const newVenueResponse = await fetch(`${SUPABASE_URL}/rest/v1/venues`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(newVenueData),
        })

        if (!newVenueResponse.ok) {
          const errorText = await newVenueResponse.text()
          console.error(`Error creating venue record for ${venue.email}:`, errorText)
          continue
        }

        const newVenueResult = await newVenueResponse.json()
        const newVenue = Array.isArray(newVenueResult) ? newVenueResult[0] : newVenueResult
        const venueError = newVenue?.id ? null : { message: 'Failed to get venue ID from response' }

        if (venueError || !newVenue?.id) {
          console.error(`Error creating venue record for ${venue.email}:`, venueError?.message)
          continue
        }
        venueId = newVenue.id
      }

      console.log(`✓ Venue record created/updated for ${venue.venue_data.venue_name}`)

      // Populate venue_locations table
      if (venue.venue_data.location) {
        const locationData: {
          venue_id: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          latitude?: number | null
          longitude?: number | null
          public_transport?: string[] | null
          parking?: string | null
          pmr_access?: boolean | null
        } = {
          venue_id: venueId,
        }

        if (venue.venue_data.location.address) {
          // Parse address to extract city and postal code if possible
          const addressParts = venue.venue_data.location.address.split(',')
          if (addressParts.length >= 2) {
            locationData.address = addressParts[0].trim()
            const cityPostal = addressParts[1].trim()
            // Try to extract postal code (5 digits) and city
            const postalMatch = cityPostal.match(/(\d{5})\s*(.+)/)
            if (postalMatch) {
              locationData.postal_code = postalMatch[1]
              locationData.city = postalMatch[2]
            } else {
              locationData.city = cityPostal
            }
            if (addressParts.length >= 3) {
              locationData.country = addressParts[2].trim()
            }
          } else {
            locationData.address = venue.venue_data.location.address
          }
        }
        if (venue.venue_data.location.coordinates?.lat) locationData.latitude = venue.venue_data.location.coordinates.lat
        if (venue.venue_data.location.coordinates?.lng) locationData.longitude = venue.venue_data.location.coordinates.lng
        if (venue.venue_data.location.public_transport) locationData.public_transport = Array.isArray(venue.venue_data.location.public_transport) ? venue.venue_data.location.public_transport : null
        if (venue.venue_data.location.parking) locationData.parking = venue.venue_data.location.parking
        if (venue.venue_data.location.pmr_access !== undefined) locationData.pmr_access = venue.venue_data.location.pmr_access

        const { error: locationError } = await supabaseAdmin
          .from('venue_locations')
          .upsert(locationData, { onConflict: 'venue_id' })

        if (locationError) {
          console.error(`Error inserting location for ${venue.email}:`, locationError.message)
        } else {
          console.log(`✓ Inserted location data`)
        }
      }

      // Populate venue_genres table
      if (venue.venue_data.programming?.preferred_genres && Array.isArray(venue.venue_data.programming.preferred_genres)) {
        // Delete existing genres
        await supabaseAdmin
          .from('venue_genres')
          .delete()
          .eq('venue_id', venueId)

        // Insert preferred genres
        if (venue.venue_data.programming.preferred_genres.length > 0) {
          const genresToInsert = venue.venue_data.programming.preferred_genres
            .filter((g: unknown) => typeof g === 'string' && g.trim() !== '')
            .map((genre: string) => ({
              venue_id: venueId,
              genre: genre.trim(),
              is_preferred: true,
            }))

          if (genresToInsert.length > 0) {
            const { error: genresError } = await supabaseAdmin
              .from('venue_genres')
              .insert(genresToInsert)

            if (genresError) {
              console.error(`Error inserting genres for ${venue.email}:`, genresError.message)
            } else {
              console.log(`✓ Inserted ${genresToInsert.length} preferred genres`)
            }
          }
        }

        // Insert excluded genres as non-preferred
        if (venue.venue_data.programming.excluded_genres && Array.isArray(venue.venue_data.programming.excluded_genres) && venue.venue_data.programming.excluded_genres.length > 0) {
          const excludedGenresToInsert = venue.venue_data.programming.excluded_genres
            .filter((g: unknown) => typeof g === 'string' && g.trim() !== '')
            .map((genre: string) => ({
              venue_id: venueId,
              genre: genre.trim(),
              is_preferred: false,
            }))

          if (excludedGenresToInsert.length > 0) {
            const { error: excludedGenresError } = await supabaseAdmin
              .from('venue_genres')
              .insert(excludedGenresToInsert)

            if (excludedGenresError) {
              console.error(`Error inserting excluded genres for ${venue.email}:`, excludedGenresError.message)
            } else {
              console.log(`✓ Inserted ${excludedGenresToInsert.length} excluded genres`)
            }
          }
        }
      }

      // Populate venue_technical_equipment table
      if (venue.venue_data.technical_equipment) {
        const techData: {
          venue_id: string
          sound_system?: string | null
          lighting?: string | null
          stage_dimensions?: string | null
          control_room?: string | null
          artist_spaces?: string | null
        } = {
          venue_id: venueId,
        }

        if (venue.venue_data.technical_equipment.sound_system) techData.sound_system = venue.venue_data.technical_equipment.sound_system
        if (venue.venue_data.technical_equipment.lighting) techData.lighting = venue.venue_data.technical_equipment.lighting
        if (venue.venue_data.technical_equipment.stage) techData.stage_dimensions = venue.venue_data.technical_equipment.stage
        if (venue.venue_data.technical_equipment.control_room) techData.control_room = venue.venue_data.technical_equipment.control_room
        if (venue.venue_data.technical_equipment.artist_spaces) techData.artist_spaces = venue.venue_data.technical_equipment.artist_spaces

        const { error: techError } = await supabaseAdmin
          .from('venue_technical_equipment')
          .upsert(techData, { onConflict: 'venue_id' })

        if (techError) {
          console.error(`Error inserting technical equipment for ${venue.email}:`, techError.message)
        } else {
          console.log(`✓ Inserted technical equipment data`)
        }
      }

      // Populate venue_programming table
      if (venue.venue_data.programming) {
        // Parse budget range if it's a string like "€500 - €2000 per show"
        let budgetMin: number | null = null
        let budgetMax: number | null = null
        if (venue.venue_data.programming.budget_range) {
          const budgetMatch = venue.venue_data.programming.budget_range.match(/(\d+)\s*-\s*(\d+)/)
          if (budgetMatch) {
            budgetMin = parseInt(budgetMatch[1], 10)
            budgetMax = parseInt(budgetMatch[2], 10)
          }
        }

        const programmingData: {
          venue_id: string
          event_frequency?: string | null
          preferred_schedule?: string | null
          budget_range_min?: number | null
          budget_range_max?: number | null
        } = {
          venue_id: venueId,
        }

        if (venue.venue_data.programming.event_frequency) programmingData.event_frequency = venue.venue_data.programming.event_frequency
        if (venue.venue_data.programming.preferred_schedule) programmingData.preferred_schedule = venue.venue_data.programming.preferred_schedule
        if (budgetMin !== null) programmingData.budget_range_min = budgetMin
        if (budgetMax !== null) programmingData.budget_range_max = budgetMax

        const { error: programmingError } = await supabaseAdmin
          .from('venue_programming')
          .upsert(programmingData, { onConflict: 'venue_id' })

        if (programmingError) {
          console.error(`Error inserting programming data for ${venue.email}:`, programmingError.message)
        } else {
          console.log(`✓ Inserted programming data`)
        }
      }

      // Populate venue_services table
      if (venue.venue_data.services) {
        const servicesData: {
          venue_id: string
          accommodation_available?: boolean
          accommodation_capacity?: number | null
          catering_available?: boolean
          catering_type?: string | null
          ticketing?: string | null
        } = {
          venue_id: venueId,
        }

        if (venue.venue_data.services.accommodation) {
          servicesData.accommodation_available = venue.venue_data.services.accommodation.available || false
          if (venue.venue_data.services.accommodation.capacity) {
            servicesData.accommodation_capacity = venue.venue_data.services.accommodation.capacity
          }
        } else {
          servicesData.accommodation_available = false
        }

        if (venue.venue_data.services.catering) {
          servicesData.catering_available = venue.venue_data.services.catering.available || false
          if (venue.venue_data.services.catering.type) {
            servicesData.catering_type = venue.venue_data.services.catering.type
          }
        } else {
          servicesData.catering_available = false
        }

        if (venue.venue_data.services.ticketing) {
          servicesData.ticketing = venue.venue_data.services.ticketing
        }

        const { error: servicesError } = await supabaseAdmin
          .from('venue_services')
          .upsert(servicesData, { onConflict: 'venue_id' })

        if (servicesError) {
          console.error(`Error inserting services data for ${venue.email}:`, servicesError.message)
        } else {
          console.log(`✓ Inserted services data`)
        }
      }
    } catch (error) {
      console.error(`Unexpected error for ${venue.email}:`, error)
    }
    console.log('')
  }

  console.log('=== SEEDING COMPLETE ===')
  console.log(`Successfully seeded ${SAMPLE_ARTISTS.length} artists and ${SAMPLE_VENUES.length} venues`)
}

seedDatabase().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

