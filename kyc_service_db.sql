--
-- PostgreSQL database dump
--

\restrict RB4Zew6gQhU1VevgeMngJdGa3uqI8BwWiYEjo88nbmrkl9xeWg8K4FwCdnd0FxH

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client_admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_admin_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    role character varying DEFAULT 'owner'::character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "clientAppId" uuid
);


ALTER TABLE public.client_admin_users OWNER TO postgres;

--
-- Name: client_apps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_apps (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "clientId" character varying NOT NULL,
    "clientSecretHash" character varying NOT NULL,
    "allowedRedirectUrls" text[] NOT NULL,
    "webhookUrl" character varying,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.client_apps OWNER TO postgres;

--
-- Name: kyc_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kyc_documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "documentType" character varying NOT NULL,
    "originalFileName" character varying NOT NULL,
    "minioObjectKey" character varying NOT NULL,
    "mimeType" character varying NOT NULL,
    size integer NOT NULL,
    status character varying DEFAULT 'uploaded'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "ocrFullText" text,
    "ocrLines" jsonb,
    "ocrCheckedAt" timestamp without time zone,
    "ocrFirstName" character varying,
    "ocrLastName" character varying,
    "ocrDocumentNumber" character varying,
    "ocrDateOfBirth" date,
    "sessionId" uuid
);


ALTER TABLE public.kyc_documents OWNER TO postgres;

--
-- Name: kyc_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kyc_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "externalUserId" character varying NOT NULL,
    "documentType" character varying,
    "redirectUrl" character varying NOT NULL,
    status character varying DEFAULT 'created'::character varying NOT NULL,
    token character varying NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "completedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "reviewStatus" character varying,
    "reviewRemarks" text,
    "reviewedBy" character varying,
    "reviewedAt" timestamp without time zone,
    "faceMatchStatus" character varying,
    "faceMatchScore" double precision,
    "faceMatchConfidence" double precision,
    "faceCheckedAt" timestamp without time zone,
    "clientAppId" uuid
);


ALTER TABLE public.kyc_sessions OWNER TO postgres;

--
-- Name: system_admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_admin_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    role character varying DEFAULT 'super_admin'::character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.system_admin_users OWNER TO postgres;

--
-- Data for Name: client_admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_admin_users (id, name, email, "passwordHash", role, status, "createdAt", "clientAppId") FROM stdin;
9d3f6440-b70d-4083-bee4-8a8ba1406b2e	abccp	abccp@test.com	$2b$10$7ta.ayFAM4uqpDVf6xZZA.4NChN54qXyGX9Ybb9jpnkQisCy8vwWu	owner	active	2026-06-13 01:24:16.764365	cc2aec19-84c0-4575-b260-8498007e73e7
f4af5dd5-7174-43cc-b715-7817228f0fda	Statement Admin	admin@test.com	$2b$10$b9uMbS37BwbKiaITReISJemE52xk3JrCLCEG8sPOD2Kk9Q/6r6.dW	owner	active	2026-06-15 00:04:49.496696	f27ce999-3d1e-4177-8747-22b0c0d2ac7a
\.


--
-- Data for Name: client_apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_apps (id, name, "clientId", "clientSecretHash", "allowedRedirectUrls", "webhookUrl", status, "createdAt") FROM stdin;
cc2aec19-84c0-4575-b260-8498007e73e7	abccp	app_34fb2f7a2e0f230a757d07ff	$2b$10$5k1MKiBsL.9pwL7zrc4aveTcQ0qEPtEF6dokTQTTj3jEIFKe7j9Zm	{https://cos.apprain.ca/kyc/callback}	https://cos.service.apprain.ca/api/kyc/webhook	active	2026-06-13 01:19:59.035396
5343d839-c6ad-472e-bab4-94ad3dd8d312	sandbox	app_43bfa1bacf4435bfc2405459	$2b$10$YRIpRbXz2nw8hD.ekd9xAuxatMC4WisoUL5Yv/NTauzOcsx1LwAT2	{https://localhost/kyc/callback}	https://localhost/api/kyc/webhook	active	2026-06-16 21:56:13.604813
f27ce999-3d1e-4177-8747-22b0c0d2ac7a	statement	app_28e03c1868d8cc8adc129e6a	$2b$10$jEKj7V3ew04lcc/cKL0MXe.WgE.7aBf8DGIQgO9Qye8j8frPo4vc2	{http://trustledger.apprain.ca/kyc/callback}	https://20.151.59.28:3001/api/kyc/webhook	active	2026-06-14 20:26:09.843157
\.


--
-- Data for Name: kyc_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kyc_documents (id, "documentType", "originalFileName", "minioObjectKey", "mimeType", size, status, "createdAt", "ocrFullText", "ocrLines", "ocrCheckedAt", "ocrFirstName", "ocrLastName", "ocrDocumentNumber", "ocrDateOfBirth", "sessionId") FROM stdin;
\.


--
-- Data for Name: kyc_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kyc_sessions (id, "externalUserId", "documentType", "redirectUrl", status, token, "expiresAt", "completedAt", "createdAt", "reviewStatus", "reviewRemarks", "reviewedBy", "reviewedAt", "faceMatchStatus", "faceMatchScore", "faceMatchConfidence", "faceCheckedAt", "clientAppId") FROM stdin;
\.


--
-- Data for Name: system_admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_admin_users (id, name, email, "passwordHash", role, status, "createdAt") FROM stdin;
b4b922e2-1c70-4449-9ff0-3ef34ce14648	System Admin	admin@kyc.com	$2b$10$yreY0VW6BOWkEazgfUphR.vL8Z3X3dlqVV7S47SkmfnDoou98QiIG	super_admin	active	2026-06-13 01:17:24.131799
\.


--
-- Name: kyc_documents PK_02e49877f1578e6285f84e57ab6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_documents
    ADD CONSTRAINT "PK_02e49877f1578e6285f84e57ab6" PRIMARY KEY (id);


--
-- Name: system_admin_users PK_0afb546e0143c881a9b65b6ac56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_admin_users
    ADD CONSTRAINT "PK_0afb546e0143c881a9b65b6ac56" PRIMARY KEY (id);


--
-- Name: client_admin_users PK_57df55ba5dbe6c50f37864dfa42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_admin_users
    ADD CONSTRAINT "PK_57df55ba5dbe6c50f37864dfa42" PRIMARY KEY (id);


--
-- Name: kyc_sessions PK_b8c512c5fa4e326ed67ce065c19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_sessions
    ADD CONSTRAINT "PK_b8c512c5fa4e326ed67ce065c19" PRIMARY KEY (id);


--
-- Name: client_apps PK_bbd706d9ce0b0e22ab367c64384; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_apps
    ADD CONSTRAINT "PK_bbd706d9ce0b0e22ab367c64384" PRIMARY KEY (id);


--
-- Name: kyc_sessions UQ_125a7a2d7fb357e37fa07e2eedd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_sessions
    ADD CONSTRAINT "UQ_125a7a2d7fb357e37fa07e2eedd" UNIQUE (token);


--
-- Name: client_admin_users UQ_bf1d4a47d0e87d6df8fc93cffae; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_admin_users
    ADD CONSTRAINT "UQ_bf1d4a47d0e87d6df8fc93cffae" UNIQUE (email);


--
-- Name: system_admin_users UQ_c386da29a036e5aae0043a6bd98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_admin_users
    ADD CONSTRAINT "UQ_c386da29a036e5aae0043a6bd98" UNIQUE (email);


--
-- Name: client_apps UQ_f6a57d8f50c25715ce14c6a35c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_apps
    ADD CONSTRAINT "UQ_f6a57d8f50c25715ce14c6a35c3" UNIQUE ("clientId");


--
-- Name: kyc_sessions FK_a0bd69be5b022b2f871599a6635; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_sessions
    ADD CONSTRAINT "FK_a0bd69be5b022b2f871599a6635" FOREIGN KEY ("clientAppId") REFERENCES public.client_apps(id);


--
-- Name: client_admin_users FK_afd4af15ea6ae29962176b2ff60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_admin_users
    ADD CONSTRAINT "FK_afd4af15ea6ae29962176b2ff60" FOREIGN KEY ("clientAppId") REFERENCES public.client_apps(id);


--
-- Name: kyc_documents FK_b738f3fc3a4bd5b34a6b1cc9ec2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_documents
    ADD CONSTRAINT "FK_b738f3fc3a4bd5b34a6b1cc9ec2" FOREIGN KEY ("sessionId") REFERENCES public.kyc_sessions(id);


--
-- PostgreSQL database dump complete
--

\unrestrict RB4Zew6gQhU1VevgeMngJdGa3uqI8BwWiYEjo88nbmrkl9xeWg8K4FwCdnd0FxH

