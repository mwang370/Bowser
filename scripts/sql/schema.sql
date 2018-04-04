DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
    event_id serial PRIMARY KEY,
    action_type character varying(16) NOT NULL,
    tab_id integer NOT NULL,
    user_id character varying(32) NOT NULL,
    occurred_at bigint NOT NULL,
    url text,
    data text
);
