--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    deal_id integer,
    user_id integer,
    comment_text text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO u3l6jydkaavcw;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.contacts (
    contact_id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    message text,
    reason character varying(50),
    business_name character varying(255),
    phone character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contacts OWNER TO u3l6jydkaavcw;

--
-- Name: contacts_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.contacts_contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_contact_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.contacts_contact_id_seq OWNED BY public.contacts.contact_id;


--
-- Name: deals; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.deals (
    deal_id integer NOT NULL,
    restaurant_id integer,
    title character varying(255),
    description text,
    price numeric(10,2),
    day_of_week character varying(10),
    category character varying(100),
    second_category character varying(100),
    start_time time without time zone,
    end_time time without time zone,
    is_approved boolean DEFAULT false,
    is_promoted boolean DEFAULT false,
    promoted_until timestamp without time zone,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    price_per_wing numeric,
    deal_type character varying(50) DEFAULT 'flat'::character varying,
    category_details text,
    price_type character varying(20) DEFAULT 'flat'::character varying,
    flat_price numeric(10,2),
    percentage_discount numeric(5,2),
    promotion_tier integer DEFAULT 0,
    CONSTRAINT chk_deal_type CHECK (((deal_type)::text = ANY ((ARRAY['flat'::character varying, 'percentage'::character varying, 'event'::character varying])::text[])))
);


ALTER TABLE public.deals OWNER TO u3l6jydkaavcw;

--
-- Name: deals_deal_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.deals_deal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deals_deal_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: deals_deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.deals_deal_id_seq OWNED BY public.deals.deal_id;


--
-- Name: imported_restaurants; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.imported_restaurants (
    imported_restaurant_id integer NOT NULL,
    google_place_id character varying(255),
    name character varying(255),
    address character varying(255),
    city character varying(100),
    province character varying(100),
    postal_code character varying(20),
    phone character varying(20),
    website character varying(255),
    lat numeric(9,6),
    lng numeric(9,6),
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone
);


ALTER TABLE public.imported_restaurants OWNER TO u3l6jydkaavcw;

--
-- Name: imported_restaurants_imported_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.imported_restaurants_imported_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.imported_restaurants_imported_restaurant_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: imported_restaurants_imported_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.imported_restaurants_imported_restaurant_id_seq OWNED BY public.imported_restaurants.imported_restaurant_id;


--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.password_resets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_resets OWNER TO u3l6jydkaavcw;

--
-- Name: password_resets_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.password_resets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_resets_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: password_resets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.password_resets_id_seq OWNED BY public.password_resets.id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.restaurants (
    restaurant_id integer NOT NULL,
    master_business_id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    business_status character varying(50),
    address character varying(255),
    city character varying(50),
    website character varying(255),
    geometry_location_lat double precision,
    geometry_location_lng double precision,
    geometry_viewport_northeast_lat double precision,
    geometry_viewport_northeast_lng double precision,
    geometry_viewport_southwest_lat double precision,
    geometry_viewport_southwest_lng double precision,
    opening_hours_open_now boolean,
    place_id character varying(255),
    plus_code_compound_code character varying(255),
    plus_code_global_code character varying(255),
    price_level integer,
    rating double precision,
    reference character varying(255),
    types character varying(255),
    user_ratings_total integer,
    normalized_name character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.restaurants OWNER TO u3l6jydkaavcw;

--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.restaurants_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNED BY public.restaurants.restaurant_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    display_name character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    role character varying(50) DEFAULT 'user'::character varying,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO u3l6jydkaavcw;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: u3l6jydkaavcw
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO u3l6jydkaavcw;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u3l6jydkaavcw
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: contacts contact_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.contacts ALTER COLUMN contact_id SET DEFAULT nextval('public.contacts_contact_id_seq'::regclass);


--
-- Name: deals deal_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.deals ALTER COLUMN deal_id SET DEFAULT nextval('public.deals_deal_id_seq'::regclass);


--
-- Name: imported_restaurants imported_restaurant_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.imported_restaurants ALTER COLUMN imported_restaurant_id SET DEFAULT nextval('public.imported_restaurants_imported_restaurant_id_seq'::regclass);


--
-- Name: password_resets id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.password_resets ALTER COLUMN id SET DEFAULT nextval('public.password_resets_id_seq'::regclass);


--
-- Name: restaurants restaurant_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurants_restaurant_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (contact_id);


--
-- Name: deals deals_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pkey PRIMARY KEY (deal_id);


--
-- Name: imported_restaurants imported_restaurants_google_place_id_key; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.imported_restaurants
    ADD CONSTRAINT imported_restaurants_google_place_id_key UNIQUE (google_place_id);


--
-- Name: imported_restaurants imported_restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.imported_restaurants
    ADD CONSTRAINT imported_restaurants_pkey PRIMARY KEY (imported_restaurant_id);


--
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_master_business_id_key; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_master_business_id_key UNIQUE (master_business_id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: deals deals_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id) ON DELETE CASCADE;


--
-- Name: password_resets password_resets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u3l6jydkaavcw
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO sjvrdhzbxwg6m;
GRANT ALL ON SCHEMA public TO u3l6jydkaavcw;


--
-- PostgreSQL database dump complete
--

