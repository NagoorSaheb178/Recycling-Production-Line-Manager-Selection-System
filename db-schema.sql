
-- ==========================================================
-- RecycleFlow: Production Line Manager Selection System
-- ==========================================================

CREATE TABLE candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    experience_years INT DEFAULT 0,
    skills JSON,
    bio TEXT,
    previous_role VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id VARCHAR(36) NOT NULL,
    crisis_management_score INT CHECK (crisis_management_score BETWEEN 0 AND 100),
    sustainability_score INT CHECK (sustainability_score BETWEEN 0 AND 100),
    motivation_score INT CHECK (motivation_score BETWEEN 0 AND 100),
    ai_summary TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE VIEW rankings AS
SELECT 
    c.id,
    c.name,
    c.experience_years,
    (e.crisis_management_score + e.sustainability_score + e.motivation_score) / 3 AS total_index,
    RANK() OVER (ORDER BY (e.crisis_management_score + e.sustainability_score + e.motivation_score) DESC) as candidate_rank
FROM candidates c
LEFT JOIN evaluations e ON c.id = e.candidate_id;

-- SAMPLE DATA (40 Candidates)
-- Ensuring IDs match the frontend generator (c1, c2, etc.)
INSERT INTO candidates (id, name, experience_years, previous_role, avatar) VALUES
('c1', 'Liam Smith', 12, 'Plant Supervisor', 'https://i.pravatar.cc/300?u=LiamSmith'),
('c2', 'Olivia Johnson', 8, 'Safety Officer', 'https://i.pravatar.cc/300?u=OliviaJohnson'),
('c3', 'Noah Williams', 15, 'Operations Lead', 'https://i.pravatar.cc/300?u=NoahWilliams'),
('c4', 'Emma Brown', 5, 'Floor Manager', 'https://i.pravatar.cc/300?u=EmmaBrown'),
('c5', 'James Jones', 10, 'Logistics Coordinator', 'https://i.pravatar.cc/300?u=JamesJones'),
('c6', 'Ava Garcia', 7, 'Shift Supervisor', 'https://i.pravatar.cc/300?u=AvaGarcia'),
('c7', 'William Miller', 20, 'Plant Manager', 'https://i.pravatar.cc/300?u=WilliamMiller'),
('c8', 'Sophia Davis', 4, 'Junior Engineer', 'https://i.pravatar.cc/300?u=SophiaDavis'),
('c9', 'Benjamin Rodriguez', 11, 'Safety Inspector', 'https://i.pravatar.cc/300?u=BenjaminRodriguez'),
('c10', 'Isabella Martinez', 9, 'Production Lead', 'https://i.pravatar.cc/300?u=IsabellaMartinez'),
('c11', 'Lucas Hernandez', 6, 'Quality Control', 'https://i.pravatar.cc/300?u=LucasHernandez'),
('c12', 'Mia Lopez', 14, 'Operations Manager', 'https://i.pravatar.cc/300?u=MiaLopez'),
('c13', 'Henry Gonzalez', 13, 'Technical Lead', 'https://i.pravatar.cc/300?u=HenryGonzalez'),
('c14', 'Charlotte Wilson', 8, 'Shift Manager', 'https://i.pravatar.cc/300?u=CharlotteWilson'),
('c15', 'Alexander Anderson', 16, 'Site Director', 'https://i.pravatar.cc/300?u=AlexanderAnderson'),
('c16', 'Amelia Thomas', 3, 'Trainee Supervisor', 'https://i.pravatar.cc/300?u=AmeliaThomas'),
('c17', 'Sebastian Taylor', 12, 'Maintenance Head', 'https://i.pravatar.cc/300?u=SebastianTaylor'),
('c18', 'Harper Moore', 9, 'Process Engineer', 'https://i.pravatar.cc/300?u=HarperMoore'),
('c19', 'Jack Jackson', 18, 'Factory Manager', 'https://i.pravatar.cc/300?u=JackJackson'),
('c20', 'Evelyn Martin', 7, 'Line Coordinator', 'https://i.pravatar.cc/300?u=EvelynMartin'),
('c21', 'Michael Lee', 11, 'Safety Officer', 'https://i.pravatar.cc/300?u=MichaelLee'),
('c22', 'Abigail Perez', 5, 'Junior Manager', 'https://i.pravatar.cc/300?u=AbigailPerez'),
('c23', 'Daniel Thompson', 14, 'Senior Lead', 'https://i.pravatar.cc/300?u=DanielThompson'),
('c24', 'Ella White', 6, 'Shift Supervisor', 'https://i.pravatar.cc/300?u=EllaWhite'),
('c25', 'Jacob Harris', 10, 'Ops Specialist', 'https://i.pravatar.cc/300?u=JacobHarris'),
('c26', 'Scarlett Sanchez', 8, 'Quality Manager', 'https://i.pravatar.cc/300?u=ScarlettSanchez'),
('c27', 'Logan Clark', 12, 'Production Head', 'https://i.pravatar.cc/300?u=LoganClark'),
('c28', 'Victoria Ramirez', 15, 'Plant Manager', 'https://i.pravatar.cc/300?u=VictoriaRamirez'),
('c29', 'Levi Lewis', 4, 'Team Lead', 'https://i.pravatar.cc/300?u=LeviLewis'),
('c30', 'Madison Robinson', 9, 'Logistics Head', 'https://i.pravatar.cc/300?u=MadisonRobinson'),
('c31', 'David Walker', 11, 'Safety Director', 'https://i.pravatar.cc/300?u=DavidWalker'),
('c32', 'Luna Young', 7, 'Coordinator', 'https://i.pravatar.cc/300?u=LunaYoung'),
('c33', 'Joseph Allen', 13, 'Senior Engineer', 'https://i.pravatar.cc/300?u=JosephAllen'),
('c34', 'Grace King', 6, 'Supervisor', 'https://i.pravatar.cc/300?u=GraceKing'),
('c35', 'Samuel Wright', 17, 'Director', 'https://i.pravatar.cc/300?u=SamuelWright'),
('c36', 'Chloe Scott', 8, 'Manager', 'https://i.pravatar.cc/300?u=ChloeScott'),
('c37', 'Sebastian Torres', 5, 'Lead', 'https://i.pravatar.cc/300?u=SebastianTorres'),
('c38', 'Penelope Nguyen', 10, 'Specialist', 'https://i.pravatar.cc/300?u=PenelopeNguyen'),
('c39', 'John Hill', 14, 'Ops Manager', 'https://i.pravatar.cc/300?u=JohnHill'),
('c40', 'Riley Adams', 9, 'Safety Lead', 'https://i.pravatar.cc/300?u=RileyAdams');
