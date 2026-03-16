/*const express = require('express');
const app = express();

app.use(express.json());


// ---------------- AUTH MOCK ----------------
const Auth = () => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        // Ha nincs auth, vagy rossz token
        if (!authHeader || authHeader !== "Bearer fakeToken123") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Auth OK
        req.uid = 1;
        next();
    };
};

// ================== BARBER ROUTES ==================
app.post('/barberReg', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    res.status(200).json({ message: 'Barber registered successfully' });
});

app.get('/barberGet', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([{ id: 1, name: 'John' }]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.post('/barberLogin', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    res.status(201).json({ token: 'fakeToken123' });
});

app.put('/barberUpdate/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Barber updated' });
    res.status(401).json({ message: 'Unauthorized' });
});

app.delete('/barberDelete/:id', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Barber deleted' });
    res.status(401).json({ message: 'Unauthorized' });
});

// ================== USER ROUTES ==================
app.post('/userReg', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    res.status(200).json({ message: 'User registered' });
});

app.get('/userGet', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([{ id: 1, name: 'Alice' }]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.post('/userLogin', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({error: 'Bad Request'});
    if (req.body.trigger === 'error401') return res.status(401).json({error: 'Unauthorized'});
    if (req.body.trigger === 'error500') return res.status(500).json({error: 'Internal Server Error'});

    return res.status(200).json({message: 'Login successful'});
});

app.put('/userUpdate/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'User updated' });
    res.status(401).json({ message: 'Unauthorized' });
});

app.delete('/userDelete/:id', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'User deleted' });
    res.status(401).json({ message: 'Unauthorized' });
});

// ================== APPOINTMENT ROUTES ==================
app.post("/appointmentPost", Auth(), async (req, res) => {
    try {
      if (req.body.trigger === "error400") return res.status(400).json({ message: "Hibás adat" });
      if (req.body.trigger === "error500") return res.status(500).json({ message: "Szerverhiba" });
  
      // valós adatbeszúrás
      return res.status(200).json({ message: "Sikeres létrehozás" });
    } catch (err) {
      return res.status(500).json({ message: "Szerverhiba" });
    }
  });

  app.get("/appointmentGet", Auth(), async (req, res) => {
    try {
      // ha minden OK, visszaadjuk a találatokat
      res.status(200).json({ appointments: [] });
    } catch (err) {
      res.status(500).json({ message: "Szerverhiba" });
    }
  });

app.get('/appointmentMyBarber', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.get('/appointmentMyUser', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.put("/appointmentUpdate/:id", Auth(), async (req, res) => {
    try {
      const { trigger } = req.body;
  
      if (trigger === "error400") return res.status(400).json({ message: "Hibás adat" });
      if (trigger === "error500") return res.status(500).json({ message: "Szerverhiba" });
  
      // létező id ellenőrzése
      const appointmentExists = true; // pl. db lekérdezés
      if (!appointmentExists) return res.status(404).json({ message: "Nincs ilyen ID" });
  
      return res.status(200).json({ message: "Sikeres frissítés" });
    } catch (err) {
      return res.status(500).json({ message: "Szerverhiba" });
    }
  });
  app.delete("/appointmentDelete/:id", Auth(), async (req, res) => {
    try {
      const id = req.params.id;
      const trigger = req.body?.trigger;
  
      // Teszt trigger-ek
      if (trigger === "error400") return res.status(400).json({ message: "Hiba 400" });
      if (trigger === "error500") throw new Error("Hiba 500");
  
      // Ellenőrzés, hogy létezik-e a rekord
      const appointment = await dbHandler.appointments.findOne({ where: { id } });
      if (!appointment) return res.status(400).json({ message: "Nincs ilyen időpont" });
  
      await dbHandler.appointments.destroy({ where: { id } });
      return res.status(200).json({ message: "Sikeres törlés" });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Szerverhiba" });
    }
  });

// ================== SERVICES ROUTES
app.post('/servicesPost', Auth(), (req, res) => {
    const trigger = req.body.trigger;

    if (trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });

    res.status(200).json({ message: 'Service created' });
});

app.get('/servicesMy', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.get('/servicesGet', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.put('/servicesUpdate/:id', Auth(), (req, res) => {
    const trigger = req.body.trigger;

    if (!req.uid) return res.status(401).json({ message: 'Unauthorized' }); // Auth hiánya

    if (trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });

    return res.status(200).json({ message: 'Service updated' });
});

app.delete("/servicesDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id;
        const barberID = req.uid;

        if (req.body.trigger === 'error400') return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        if (req.body.trigger === 'error500') throw new Error("Szerverhiba");

        // Mock DB check
        const oneService = { id: Id, barberID }; // pl. van service
        if (!oneService) return res.status(400).json({ message: "Nincs ilyen szolgáltatás" });

        // Mock DB delete
        return res.status(200).json({ message: "Sikeres törlés" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//WORKHOURS ROUTES
app.post('/workhoursPost', Auth(), (req, res) => {
    const trigger = req.body.trigger;

    if (trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });

    // sima sikeres létrehozás
    return res.status(200).json({ message: 'Workhours created' });
});

app.get('/workhoursGet', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.get('/workhoursMy', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.put('/workhoursUpdate/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Workhours updated' });
    res.status(401).json({ message: 'Unauthorized' });
});

app.delete('/workhoursDelete/:id', Auth(), (req, res) => {
    const trigger = req.body.trigger;

    if (trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });

    return res.status(200).json({ message: 'Workhours deleted', id: req.params.id });
});


// Export server for Supertest
module.exports = app;*/