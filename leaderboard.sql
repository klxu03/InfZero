CREATE TABLE allTimeLeaderboard (
    id SERIAL,
    position INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    score BIGINT NOT NULL,
    grade INT NOT NULL,
    date VARCHAR(15) NOT NULL,
    time VARCHAR(15) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE dailyLeaderboard(
    id SERIAL,
    position INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    grade INT NOT NULL,
    date VARCHAR(15) NOT NULL,
    time VARCHAR(15) NOT NULL,
    PRIMARY KEY (id)
);