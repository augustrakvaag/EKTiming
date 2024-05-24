DROP TABLE Event;
DROP TABLE HeatLane;
DROP TABLE Class;
DROP TABLE Contestant;

CREATE TABLE Event (
    event_id TEXT PRIMARY KEY,
    eventDescription TEXT,
    pw TEXT
);

CREATE TABLE HeatLane(
    heatLane_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    event_id TEXT,
    heat TEXT,
    lane INT,
    swimStartTime INT,
    ended BOOL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABELE Class(
    class_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    class_name TEXT,
    class_description TEXT
);

CREATE TABLE Contestant (
    contestant_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    event_id TEXT,
    class_id INT,
    fullName TEXT,
    startNr INT, 
    -- SWIM   
    heatLane_id INT,
    swimEndTime INT,
    -- RUN
    runStartTime INT,
    runEndTime INT,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (heatLane_id) REFERENCES HeatLane(heatLane_id) ON UPDATE CASCADE
);


INSERT INTO Event (event_id, eventDescription, pw) VALUES ('NULL', '', '_');
INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES (NULL, 'EMPTY', 1, 1, 1); -- This Heat is used by the application for the contestants that gets manual swim times (their swim time will be off by 0.001 second) 

------------- A Test Case (Not Needed) -------------
INSERT INTO Event (event_id, eventDescription, pw) VALUES ('Test', '', 'admin1828');
INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES ('Test', 'Heat A', 1, 0, 0);
INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES ('Test', 'Heat A', 2, 0, 0);
INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES ('Test', 'Heat B', 1, 0, 0);
INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES ('Test', 'Heat B', 2, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'Estil Krågebakk', 69, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'Ola Nordman', 68, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'Kari Nordman', 67, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'Full Name', 66, 2, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'Super duper long name', 64, 2, 0, 0, 0);

INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 1, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 2, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 3, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 4, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 5, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 6, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 7, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 8, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 9, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 10, 1, 0, 0, 0);
INSERT INTO Contestant(event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES ('Test', 'qwrerty', 11, 1, 0, 0, 0);
