CREATE TABLE Users (
    email VARCHAR(25) NOT NULL ,
    name VARCHAR(15) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    admin BOOLEAN NOT NULL,
    password VARCHAR(100),
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE Email_Token (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(25) NOT NULL,
    token VARCHAR(100) NOT NULL,
    name VARCHAR(15) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Library (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    location_road VARCHAR(30) NOT NULL,
    location_number VARCHAR(30) NOT NULL,
    location_detail VARCHAR(30) NOT NULL,
    manager_email VARCHAR(25) NOT NULL,
    fac_beam_screan BOOLEAN NOT NULL,
    fac_sound BOOLEAN NOT NULL,
    fac_record BOOLEAN NOT NULL,
    fac_placard BOOLEAN NOT NULL,
    fac_self_promo BOOLEAN NOT NULL,
    fac_need_volunteer BOOLEAN NOT NULL,
    latitude INT NOT NULL,
    longitude INT NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (id), 
    FOREIGN KEY (manager_email) REFERENCES Users (email) ON UPDATE CASCADE
);

CREATE TABLE Session (
    id INT NOT NULL AUTO_INCREMENT,
    library_id INT NOT NULL,
    user_email VARCHAR(25) NOT NULL,
    session_name VARCHAR(15) NOT NULL,
    session_time DATE NOT NULL,
    introduce TEXT,
    history TEXT,
    session_explainer TEXT,
    document VARCHAR(25) NOT NULL,
    admin_approved ENUM('0','1','2','3'),
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (id), 
    FOREIGN KEY (library_id) REFERENCES Library (id) ON UPDATE CASCADE,
    FOREIGN KEY (user_email) REFERENCES Users (email) ON UPDATE CASCADE
);

CREATE TABLE Volunteer (
    id INT NOT NULL AUTO_INCREMENT,
    library_id INT NOT NULL,
    user_email VARCHAR(25) NOT NULL,
    session_name VARCHAR(15) NOT NULL,
    session_time DATE NOT NULL,
    introduce TEXT,
    history TEXT,
    admin_approved ENUM('0','1','2','3'),
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (library_id) REFERENCES Library (id) ON UPDATE CASCADE,
    FOREIGN KEY (user_email) REFERENCES Users (email) ON UPDATE CASCADE
);