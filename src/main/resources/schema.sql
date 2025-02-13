create table if not exists users(
                                    username VARCHAR (100) not null primary key,
    password VARCHAR(150) not null,
    enabled boolean not null
    );

create table if not exists authorities (
                                           username VARCHAR(100) not null,
    authority VARCHAR(50) not null,
    constraint fk_authorities_users foreign key(username) references users(username) ON DELETE CASCADE
    );
/*Only run at first compile:
create unique index ix_auth_username on authorities (username,authority);*/
CREATE TABLE IF NOT EXISTS pattern
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    descr text(2000),
    instr text(2000),
    hook_size_from INT NOT NULL,
    hook_size_to INT NOT NULL,
    type VARCHAR(150) NOT NULL,
    img_url VARCHAR(250) NOT NULL,
    for_sale TINYINT(1) NOT NULL,
    price INT,
    created_by_user VARCHAR(100) NOT NULL,
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (created_by_user) REFERENCES users(username) ON DELETE CASCADE
    );



CREATE TABLE IF NOT EXISTS user_pattern (
                                            pattern INT NOT NULL ,
                                            users VARCHAR(100) NOT NULL,
    primary key (pattern, users),
    FOREIGN KEY (pattern) REFERENCES pattern(id) ON DELETE CASCADE,
    FOREIGN KEY (users) REFERENCES users(username) ON DELETE CASCADE

    );

CREATE TABLE IF NOT EXISTS species (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       name VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS material (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        name VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS pattern_material (
                                                material INT NOT NULL ,
                                                pattern INT NOT NULL,
                                                PRIMARY KEY  (material, pattern),
    FOREIGN KEY (material) REFERENCES material(id) ON DELETE CASCADE,
    FOREIGN KEY (pattern) REFERENCES pattern(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS pattern_species (
                                               species INT NOT NULL ,
                                               pattern INT NOT NULL,
                                               PRIMARY KEY (species, pattern),
    FOREIGN KEY (species) REFERENCES species(id) ON DELETE CASCADE,
    FOREIGN KEY (pattern) REFERENCES pattern(id) ON DELETE CASCADE

    );

CREATE TABLE IF NOT EXISTS user_order (
                                          id INT PRIMARY KEY AUTO_INCREMENT,
                                          total_cost INT NOT NULL,
                                          date TIMESTAMP NOT NULL,
                                          user VARCHAR(100) NOT NULL,
    FOREIGN KEY (user) REFERENCES users(username) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS pattern_order (
                                             pattern INT NOT NULL,
                                             user_order INT NOT NULL,
                                             PRIMARY KEY (pattern, user_order),
    FOREIGN KEY (pattern) REFERENCES pattern(id) ON DELETE CASCADE,
    FOREIGN KEY (user_order) REFERENCES user_order(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS user_emails (
                                           id INT PRIMARY KEY AUTO_INCREMENT,
                                           user VARCHAR (100) not null,
    email VARCHAR (255) not null,
    FOREIGN KEY (user) REFERENCES users(username) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS user_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR (100) not null,
    join_date TIMESTAMP NOT NULL,
    location VARCHAR (255),
    instagram VARCHAR (255),
    youtube VARCHAR (255),
    img_url VARCHAR(250),
    FOREIGN KEY (user) REFERENCES users(username) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS restore_token (
                                             id INT PRIMARY KEY AUTO_INCREMENT,
                                             email VARCHAR (255) not null,
    token_string VARCHAR(500) not null
    );

CREATE TABLE IF NOT EXISTS page_visit_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    last_time_visited TIMESTAMP NOT NULL,
    number_of_visits INT NOT NULL

);

INSERT INTO page_visit_counter (last_time_visited, number_of_visits)
SELECT CURRENT_TIMESTAMP, 1
WHERE NOT EXISTS (SELECT 1 FROM page_visit_counter LIMIT 1);
