# Nyala Digital Academy (NDA) - Digital Archiving & IT Training Center
Bridging the Digital Gap in Darfur through Modern Infrastructure and Specialized Education.

## Project Overview

Nyala Digital Academy is a specialized IT training and service hub designed to lead the Digital Transformation in Nyala, Sudan. The project addresses the critical need for PaperlessGovernment by training local
graduatesand government employees in advanced digital archiving, networking, and cybersecurity.This repository contains the Frontend of the academy's official platform—a Progressive Web App (PWA) built to operate
in low-connectivity environments, ensuring that educational resources are always accessible.

## Tech Stack
Frontend: React.js (Component-based architecture)
Styling: Bootstrap / React-Bootstrap (Responsive UI)
Offline Capability: PWA (Service Workers, Local Cache, Manifest.json)
Networking Logic: Integrated Cisco-based lab simulations.
Planned Backend: PHP/XAMPP with SQL for robust Data Management.

## Key Features

Offline-First Design: Optimized for Nyala’s infrastructure; students can access cached lessons and labs without an active internet connection.
Digital Archiving Portal: A specialized interface for learning Document Management Systems (DMS) and OCR technologies.
Student Dashboard:** Tracks progress through Bootcamps (Networking, Archiving, Security).
Certificate Verification: A secure UI to verify graduate credentials via the SQL backend.
Dual-Language Support: Full RTL (Arabic) support for local users and LTR (English) for technical training.

## Architecture (Frontend-to-Backend Flow)

The application follows a modern data-flow pattern:

1. State Management: Utilizing React Hooks (`useState`, `useEffect`) for dynamic data exchange.
2. Proxy Communication: Securely retrieving data from the backend via proxy settings to prevent CORS issues.
3. Data Persistence: SQL-based retrieval mapped to JavaScript objects for UI rendering.

## Social Impact

This project isn't just code; it's a Solution-in-a-Box for:

1- Protecting vital government documents from physical loss.
2- Empowering the youth of Nyala with high-demand tech skills (Cisco, Web Dev).
2- Reducing administrative corruption through transparent, digital record-keeping.

## Developed By

Salem Dayfan Alalem: Network Engineer & Full-Stack Developer
Dedicated to bringing modern technology to my community.
