# Beat Marketplace Platform — LLM Build Guide

## Purpose

This document defines the **product, architecture, UI/UX, and frontend contracts** for building a beat marketplace (BeatStars-style, but more modern) using LLMs. It is intended to be given to LLMs to generate **Next.js frontend code and UI** that integrates with a Spring Boot backend.

This guide is authoritative. Do not invent features or deviate from defined flows.

---

# Tech Stack (Frontend)

* Next.js (App Router)
* TypeScript
* Bun + bunx
* shadcn/ui
* Tailwind CSS
* React Server Components where appropriate
* React Query (TanStack Query) for server state
* Zod for validation

---

# Core Product Domains

## 1. Identity & Roles

Users can have multiple roles:

* PRODUCER (seller)
* ARTIST (buyer)

Same user account can act as both.

Frontend must support:

* Role-aware routing
* Separate dashboards
* Shared authentication

---

## 2. Producer Domain (Seller)

### Producer Capabilities

* Create beats
* Upload audio + images
* Set pricing
* Publish beats
* View sales analytics
* Manage storefront

### Producer Dashboard Pages

* /producer/dashboard
* /producer/beats
* /producer/beats/new
* /producer/beats/[beatId]
* /producer/sales
* /producer/profile

---

## 3. Artist Domain (Buyer)

### Artist Capabilities

* Browse marketplace
* Preview beats
* Purchase licenses
* Download purchased beats
* Manage library

### Artist Pages

* /marketplace
* /beats/[beatId]
* /library
* /checkout
* /artist/profile

---

# Beat Lifecycle (Canonical Flow)

## Phase 1 — Beat Creation (Metadata)

Producer creates beat metadata first.

### UI Flow

1. Producer clicks "Create Beat"
2. Fill metadata form
3. Submit
4. Backend returns beatId
5. Redirect to upload screen

### Required Fields

* title
* description
* bpm
* musicalKey
* genre
* tags

---

## Phase 2 — Asset Upload (Direct to S3)

All file uploads use presigned URLs.

### Asset Types

* ORIGINAL_AUDIO
* PREVIEW_AUDIO
* THUMBNAIL_IMAGE
* COVER_IMAGE

### Upload Flow

For each asset:

1. Frontend requests presigned URL
2. Backend returns { assetId, presignedUrl, s3Key }
3. Frontend uploads directly to S3
4. Frontend calls upload-complete endpoint
5. Backend triggers async processing

### UX Requirements

* Progress bar per file
* Retry on failure
* Visual processing state

---

## Phase 3 — Async Processing

Handled by backend workers.

Frontend Responsibilities:

* Poll asset status
* Show "Processing" state
* Disable publish until required assets are READY

---

## Phase 4 — Pricing & Publishing

Producer sets pricing per license:

* BASIC
* PREMIUM
* EXCLUSIVE

Publishing rules:

* ORIGINAL_AUDIO must be READY
* PREVIEW_AUDIO must be READY
* THUMBNAIL_IMAGE recommended

---

# Marketplace Experience

## Beat Listing Card

Each beat card shows:

* Thumbnail
* Title
* Producer name
* BPM
* Genre
* Starting price
* Play preview button

---

## Beat Detail Page

Shows:

* Audio preview player
* Beat metadata
* License pricing
* Purchase CTA
* Producer profile link

---

# API Contract Assumptions

## Beat Creation

POST /api/beats

Request:

{
title: string
description?: string
bpm?: number
musicalKey?: string
genre?: string
tags?: string[]
}

Response:

{
beatId: string
}

---

## Presign Asset Upload

POST /api/beats/{beatId}/assets/presign

Request:

{
type: "ORIGINAL_AUDIO" | "PREVIEW_AUDIO" | "THUMBNAIL_IMAGE" | "COVER_IMAGE"
fileName: string
mimeType: string
}

Response:

{
assetId: string
presignedUrl: string
s3Key: string
}

---

## Upload Complete

POST /api/beats/{beatId}/assets/{assetId}/complete

Response:

{ success: true }

---

## Beat Status

GET /api/beats/{beatId}

Returns:

* Beat metadata
* Asset list with processingStatus
* Pricing
* Publish status

---

# State Machines (Frontend Must Respect)

## Asset ProcessingStatus

* UPLOADING
* UPLOADED
* PROCESSING
* READY
* FAILED

Frontend rules:

* Show spinner for PROCESSING
* Allow retry on FAILED
* Allow publish only when READY

---

## Beat Status

* DRAFT
* PUBLISHED
* ARCHIVED

Rules:

* New beats start as DRAFT
* Only DRAFT can be edited
* Only READY assets allow PUBLISHED

---

# UI Component Requirements (shadcn/ui)

Use shadcn/ui components for:

* Forms
* Dialogs
* Dropdowns
* Tables
* Toasts

Tailwind for layout + spacing.

---

# Audio Player Requirements

* HTML5 audio
* Play/pause
* Seek
* Volume
* Visual processing indicator

---

# File Upload Requirements

* Chunked uploads not required
* Show progress
* Validate mime types
* Max file size display

---

# Error Handling

* API errors shown via toast
* Upload failures allow retry
* Auth errors redirect to login

---

# Dashboard Design Rules

## Producer Dashboard

* KPI cards: sales, plays, revenue
* Beats table
* Upload progress indicators

## Artist Dashboard

* Purchased beats
* Download links
* License info

---

# Frontend Architecture Rules

* Feature-based folders
* API client layer
* Zod schemas for API
* No direct fetch in components

Example:

/app
/producer
/marketplace
/artist
/lib/api
/lib/hooks
/components

---

# Non-Goals (Do NOT Build)

* Blockchain
* NFTs
* Social network
* Messaging
* Comments

---

# Design Tone

* Minimal
* Creator-focused
* Fast
* Clean typography
* Dark + light mode

---

# LLM Instructions

When generating frontend code:

* Follow this spec strictly
* Do not invent endpoints
* Use Next.js App Router
* Use shadcn/ui components
* Use Tailwind utility classes
* Use TypeScript everywhere

---

# Success Criteria

Frontend is considered correct if:

* Producer can create beat
* Upload assets via presigned URLs
* See processing state
* Set pricing
* Publish beat
* Artist can browse + preview + purchase

---

# Optional Enhancements (Later)

* YouTube publishing
* Waveform visualization
* Advanced analytics
* Playlists

---

# Summary

This document defines the canonical frontend and UX behavior for a scalable beat marketplace using modern web tooling. All LLM-generated frontend code must conform to these flows, APIs, and state machines.
