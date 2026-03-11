<h1 align="center">Smart Cab Booking Platform</h1>

<p align="center">
<img src="https://img.shields.io/badge/Next.js-Framework-black?logo=next.js">
<img src="https://img.shields.io/badge/Supabase-Database-green?logo=supabase">
<img src="https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe">
<img src="https://img.shields.io/badge/TypeScript-Language-blue?logo=typescript">
<img src="https://img.shields.io/badge/OpenStreetMap-Maps-orange?logo=openstreetmap">
</p>

---

## Overview

A full-stack ride-hailing platform inspired by **Uber and Ola**.

This project includes **rider and driver dashboards**, real-time map routes using **OpenStreetMap and OSRM**, **Stripe payment integration**, a **support ticket system**, and an **emergency SOS safety feature**.

Built using **Next.js, Supabase, Clerk authentication, and Leaflet maps**.

---

## Tech Stack

- Next.js
- TypeScript
- Supabase
- Clerk Authentication
- Stripe Payments
- Leaflet Maps
- OpenStreetMap
- OSRM Routing Engine

---

## Features

### Rider Module
- Book rides between locations
- Real-time route visualization
- Fare estimation
- Online payment via Stripe
- Ride history
- Rate drivers after trip

### Driver Module
- Accept or reject ride requests
- View pickup and drop route
- Track ride status
- Driver ratings system

### Support System
- Submit support tickets
- View ticket status
- Issue categories

### Emergency Safety (SOS)
- Emergency SOS button
- Sends alert message
- Shares live location link via WhatsApp

---

## Screenshots

### Rider Dashboard
![Rider Dashboard](screenshots/rider.png)

### Driver Dashboard
![Driver Dashboard](screenshots/driver.png)

### Support & SOS
![Support Page](screenshots/support.png)

---

## System Architecture

The platform follows a **full-stack architecture**.

### Frontend
- Next.js
- TypeScript
- Leaflet Maps

### Backend
- Supabase Database
- Clerk Authentication
- Stripe Payment API

### External APIs
- OpenStreetMap
- OSRM Routing Engine

The system includes **rider and driver modules**, **real-time route visualization**, **payment processing**, and an **emergency SOS safety feature**.

---

## Project Structure

app/
├── rider
├── driver
├── support
├── profile
components/
├── Map
├── RideStatus
lib/
├── supabase.ts

---

## Future Improvements

- Real-time driver tracking
- Admin dashboard
- Ride analytics
- Push notifications
- Live ride sharing

---

## License

This project is licensed under the **MIT License**.
