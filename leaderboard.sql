CREATE TABLE allTimeLeaderboard (
    id SERIAL,
    position INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    score BIGINT NOT NULL,
    grade VARCHAR(20) NOT NULL,
    date VARCHAR(15) NOT NULL,
    time VARCHAR(15) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO allTimeLeaderboard (position, username, score, grade, date, time) 
VALUES
(${i}, 'PlaceHolder', 10, 'Mysterious', 'The Big Bang', 'The Big Bang');

SELECT * FROM allTimeLeaderboard ORDER BY position;