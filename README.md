<div align="center">

```
╔═══════════════════════════════════════════════════════╗
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ║
║  ┃   🚕  S M A R T  C A B  B O O K I N G         ┃  ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
║      🗺️ Routes  ·  💳 Payments  ·  🆘 Safety         ║
╚═══════════════════════════════════════════════════════╝
```

### A full-stack ride-hailing platform inspired by Uber and Ola.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white&labelColor=000000)](https://nextjs.org)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e)](https://typescriptlang.org)
&nbsp;
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=1a1a2e)](https://supabase.com)
&nbsp;
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white&labelColor=1a1a2e)](https://stripe.com)
&nbsp;
[![Demo Video](https://img.shields.io/badge/🎥_Demo-Watch_Now-FF6B35?style=for-the-badge&labelColor=1a1a2e)](https://drive.google.com/file/d/1e7BWNgDCR-4cOXzng-opOaLW1d4_g2oL/view?usp=drive_link)

</div>

---

## 🚀 Overview

> *A production-grade ride-hailing platform — from booking to billing, routing to safety.*

This project includes **rider and driver dashboards**, real-time map routes using **OpenStreetMap + OSRM**, **Stripe payment integration**, a **support ticket system**, and an **emergency SOS safety feature** — all built with **Next.js, Supabase, Clerk, and Leaflet Maps**.

```
  Rider books ride  →  Route visualized  →  Driver accepts  →  Stripe payment
         └──────────────────────┬───────────────────────────────────┘
                                │
                    SOS safety layer active throughout 🆘
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧍 Rider Module
- Book rides between locations
- Real-time route visualization
- Fare estimation
- Online payment via Stripe
- Ride history
- Rate drivers after trip

### 🚗 Driver Module
- Accept or reject ride requests
- View pickup and drop route
- Track ride status
- Driver ratings system

</td>
<td width="50%">

### 🎫 Support System
- Submit support tickets
- View ticket status
- Issue categories

### 🆘 Emergency Safety (SOS)
- Emergency SOS button
- Sends alert message
- Shares live location link via WhatsApp

</td>
</tr>
</table>

---

## 🧱 Tech Stack

<div align="center">

| Layer | Technology | Badge |
|:---:|:---:|:---:|
| **Frontend** | Next.js + TypeScript | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) ![TS](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Maps** | Leaflet + OpenStreetMap + OSRM | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white) ![OSM](https://img.shields.io/badge/OSM-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white) |
| **Database** | Supabase | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) |
| **Auth** | Clerk | ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white) |
| **Payments** | Stripe | ![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white) |

</div>

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                  │
│          TypeScript · Leaflet Maps · Tailwind        │
└───────────────┬──────────────────────┬───────────────┘
                │                      │
   ┌────────────▼────────┐  ┌──────────▼──────────────┐
   │   Supabase (DB)     │  │   External APIs          │
   │ ────────────────    │  │ ───────────────────────  │
   │  • Rider data       │  │  • OpenStreetMap tiles   │
   │  • Driver data      │  │  • OSRM routing engine   │
   │  • Tickets / SOS    │  │  • Stripe payments       │
   └─────────────────────┘  │  • Clerk authentication  │
                             └─────────────────────────┘
```

---

## 📂 Project Structure

```
smart-cab-booking/
│
├── 📱 app/
│   ├── 🧍 rider/          → Rider dashboard & booking
│   ├── 🚗 driver/         → Driver dashboard & requests
│   ├── 🎫 support/        → Support ticket system
│   └── 👤 profile/        → User profile management
│
├── 🧩 components/
│   ├── 🗺️  Map/            → Leaflet map components
│   └── 📊 RideStatus/     → Ride tracking UI
│
└── 🔧 lib/
    └── supabase.ts        → Supabase client config
```

---

## 📸 Screenshots

<div align="center">

| 🧍 Rider Dashboard | 🚗 Driver Dashboard |
|:---:|:---:|
| ![Rider Dashboard](screenshots/rider.png) | ![Driver Dashboard](screenshots/driver.png) |

| 🎫 Support & SOS |
|:---:|
| ![Support Page](screenshots/support.png) |

</div>

---

## 🎥 Project Demo

<div align="center">

[![Watch Demo](https://img.shields.io/badge/▶_Watch_Full_Demo-FF6B35?style=for-the-badge&labelColor=1a1a2e)](https://drive.google.com/file/d/1e7BWNgDCR-4cOXzng-opOaLW1d4_g2oL/view?usp=drive_link)

</div>

---

## 📈 Future Improvements

- [ ] 📍 Real-time driver tracking
- [ ] 🛠️ Admin dashboard
- [ ] 📊 Ride analytics
- [ ] 🔔 Push notifications
- [ ] 🔗 Live ride sharing

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

*Built to move people — safely, smartly, seamlessly* 🚕

[![GitHub](https://img.shields.io/badge/GitHub-Deeksh870-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=1a1a2e)](https://github.com/Deeksh870)

</div>
