const express = require('express');
const app = express();

app.use(express.json());


// ---------------- AUTH MOCK ----------------
const Auth = () => {
    return (req, res, next) => {
        const trigger = req.body.trigger; // ha tesztben trigger van, Auth ellenőrzést kihagyjuk
        if (trigger) return next(); // trigger mód, Auth ellenőrzés kihagyva

        const authHeader = req.headers.authorization;
        if (authHeader === 'Bearer fakeToken123') {
            req.uid = 1;
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
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
app.post('/appointmentPost', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    res.status(200).json({ message: 'Appointment created' });
});

app.get('/appointmentGet', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([{ id: 1, service: 'Haircut' }]);
    res.status(404).json({ message: 'Not Found' });
});

app.get('/appointmentMyBarber', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.get('/appointmentMyUser', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json([]);
    res.status(401).json({ message: 'Unauthorized' });
});

app.put('/appointmentUpdate/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Appointment updated' });
    res.status(401).json({ message: 'Unauthorized' });
});

app.delete('/appointmentDelete/:id', (req, res) => {
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Appointment deleted' });
    res.status(403).json({ message: 'Forbidden' });
});

// ================== SERVICES ROUTES
app.post('/servicesPost', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
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

app.put('/servicesUpdate/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Service updated' });
    res.status(401).json({ message: 'Unauthorized' });
});

app.delete('/servicesDelete/:id', (req, res) => {
    if (req.body.trigger === 'error400') return res.status(400).json({ message: 'Bad Request' });
    if (req.body.trigger === 'error500') return res.status(500).json({error: 'Internal Server Error'});
    if (req.headers.authorization === 'Bearer fakeToken123') return res.status(200).json({ message: 'Service deleted' });
    res.status(401).json({ message: 'Unauthorized' });
});

//WORKHOURS ROUTES
app.post('/workhoursPost', (req, res) => {
    if (req.body.trigger === 'error500') return res.status(500).json({ message: 'Internal Server Error' });
    res.status(200).json({ message: 'Workhours created' });
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
module.exports = app;