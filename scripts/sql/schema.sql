DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
    event_id serial PRIMARY KEY,
    action_type character varying(16) NOT NULL,
    tab_id integer NOT NULL,
    user_id character varying(32) NOT NULL,
    timestamp_start bigint NOT NULL,
    timestamp_end bigint NOT NULL,
    times integer,
    url text,
    data text
);
