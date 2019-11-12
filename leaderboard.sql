/* This should be obvious... This creates the table */
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

/* Use this command to go ahead and add (stock add) 500 guys */
INSERT INTO allTimeLeaderboard (position, username, score, grade, date, time) 
VALUES
(${i}, 'PlaceHolder', 10, 'Mysterious', 'The Big Bang', 'The Big Bang');

/* Use this command to grab all the data in order */
SELECT * FROM allTimeLeaderboard ORDER BY position;