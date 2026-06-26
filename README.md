 ProjexHub - MERN Stack Web Application

📌 Project Overview
A full-stack project management platform with **role-based access control** (Admin & Client). Features include client invitation, project assignment, automatic invoice generation, and **blockchain integration** for tamper-proof security and trust.

 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Context API
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Security:** Blockchain integration for data integrity

---

 🚀 Key Features

 👨‍💼 Admin Dashboard
- **Dashboard Overview:** View all clients, projects, and invoices in one place
- **Manage Clients:** View all registered clients
- **Manage Projects:** View all projects across ALL clients
- **Invite Clients:** Send email invitations to new clients
- **Assign Projects:** Allocate projects with deadlines and budgets
- **Invoice Management:** View ALL invoices (pending/paid) and pay them
- **Security Monitoring:** Detect if any database tampering occurs
- **Dark/Light Mode:** Toggle between themes

 👤 Client Dashboard
- **Dashboard Overview:** View only YOUR projects and invoices
- **Accept/Reject Projects:** Confirm or decline assigned projects
- **Invoice Viewing:** View YOUR automatically generated invoices
- **Real-time Updates:** See payment status when admin pays
- **Tamper-Proof Guarantee:** Blockchain ensures no unauthorized changes
- **Dark/Light Mode:** Toggle between themes

 🔐 Blockchain Integration
- **Immutable Records:** Once an invoice is generated, it cannot be altered
- **Tamper Detection:** Any unauthorized change (even by admin or hacker) is visible
- **Trust & Transparency:** Clients can verify that data hasn't been tampered with
- **Admin Alert:** If someone modifies the database, admin is notified

---

 🎯 User Roles

| Feature | Admin | Client |
|---------|-------|--------|
| View All Clients | ✔️ | ✖️ |
| View All Projects | ✔️ | ✖️ (Only own projects) |
| View All Invoices | ✔️ | ✖️ (Only own invoices) |
| Invite Clients | ✔️ | ✖️ |
| Assign Projects | ✔️ | ✖️ |
| Accept/Reject Projects | ✖️ | ✔️ |
| View Invoices | ✔️ | ✔️ (Own only) |
| Pay Invoices | ✔️ | ✖️ |
| Tamper-Proof Security | ✔️ | ✔️ |
| Dark/Light Mode | ✔️ | ✔️ |
---

 📂 Project Structure

```
ProjexHub/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── ThemeToggle.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── ClientsList.js
│   │   │   │   ├── AllProjects.js
│   │   │   │   └── AllInvoices.js
│   │   │   └── client/
│   │   │       ├── ClientDashboard.js
│   │   │       ├── MyProjects.js
│   │   │       ├── MyInvoices.js
│   │   │       └── AcceptRejectProject.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── LandingPage.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── ThemeContext.js
│   │   │   └── ProjectContext.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── blockchain.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Invoice.js
│   │   └── BlockchainLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── invoices.js
│   │   ├── clients.js
│   │   └── blockchain.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── invoiceController.js
│   │   ├── clientController.js
│   │   └── blockchainController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── blockchainService.js
│   │   └── invoiceGenerator.js
│   ├── config/
│   │   ├── db.js
│   │   └── blockchainConfig.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/hafsa-batool/ProjexHub.git
   cd ProjexHub
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Create a `.env` file in backend folder with:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   BLOCKCHAIN_NETWORK=your_blockchain_network
   ```

5. **Run the application**
   ```bash
   # In backend folder
   npm start

   # In frontend folder (open new terminal)
   npm start
   ```

6. **Open your browser** and go to: `http://localhost:3000`

---

📸 Screenshots
**

---

 👩‍💻 Author

**Hafsa Batool**
- GitHub: [github.com/hafsa-batool](https://github.com/hafsa-batool)
- LinkedIn: [linkedin.com/in/hafsa-batool-353b942b2](https://linkedin.com/in/hafsa-batool-353b942b2)

---

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!
```
