--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.3

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
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA _realtime;


--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgsodium;


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'Standard public schema containing application tables, optimized definitions.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_functions;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: call_outcome; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.call_outcome AS ENUM (
    'success',
    'failed',
    'follow_up',
    'rescheduled',
    'no_answer',
    'busy',
    'callback_requested',
    'handoff',
    'timed_out'
);


--
-- Name: call_purpose; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.call_purpose AS ENUM (
    'sales',
    'support',
    'feedback',
    'other',
    'complaint',
    'survey',
    'appointment',
    'billing'
);


--
-- Name: call_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.call_status AS ENUM (
    'scheduled',
    'completed',
    'canceled',
    'in_progress',
    'missed',
    'rescheduled',
    'priority'
);


--
-- Name: contact_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.contact_method AS ENUM (
    'email',
    'phone',
    'sms',
    'mail',
    'chat',
    'in_person',
    'social_media',
    'none'
);


--
-- Name: interaction_outcome; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interaction_outcome AS ENUM (
    'successful',
    'unsuccessful',
    'pending',
    'scheduled',
    'cancelled',
    'follow_up',
    'no_answer',
    'busy',
    'callback_requested',
    'handoff',
    'timed_out',
    'ordered'
);


--
-- Name: interaction_purpose; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interaction_purpose AS ENUM (
    'sales',
    'support',
    'inquiry',
    'complaint',
    'feedback',
    'survey',
    'appointment',
    'billing',
    'other'
);


--
-- Name: interaction_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interaction_status AS ENUM (
    'scheduled',
    'completed',
    'canceled',
    'missed',
    'rescheduled',
    'in_progress',
    'priority'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'canceled',
    'returned',
    'refunded',
    'user_confirmed',
    'accepted'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


--
-- Name: audit_log_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_log_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (table_name, action, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), current_setting('app.current_user_id', true)::uuid, now());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (table_name, action, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true)::uuid, now());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (table_name, action, old_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), current_setting('app.current_user_id', true)::uuid, now());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: FUNCTION audit_log_changes(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.audit_log_changes() IS 'Records data changes to the audit_logs table';


--
-- Name: commit_proposed_order(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.commit_proposed_order(call_id_input uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  proposed jsonb;
  new_order_id uuid := gen_random_uuid();
  item jsonb;
begin
  -- 1. Fetch the proposed order
  select to_jsonb(p) into proposed
  from proposed_orders p
  where p.call_id = call_id_input;

  if proposed is null then
    raise exception 'No proposed order found for call_id %', call_id_input;
  end if;

  -- 2. Insert into orders
  insert into orders (
    id,
    tenant_id,
    customer_id,
    total_amount,
    status,
    created_at
  )
  values (
    new_order_id,
    (proposed->>'tenant_id')::uuid,
    (proposed->>'customer_id')::uuid,
    (proposed->>'total')::numeric,
    'confirmed',
    current_timestamp
  );

  -- 3. Insert order_items
  for item in
    select * from jsonb_array_elements(proposed->'order_items')
  loop
    insert into order_items (
      order_id,
      product_id,
      quantity,
      price,
      tenant_id
    )
    values (
      new_order_id,
      (item->>'productId')::uuid,
      (item->>'quantity')::int,
      (item->>'price')::numeric,
      (proposed->>'tenant_id')::uuid
    );
  end loop;

  -- Optional: delete the proposed order
  delete from proposed_orders where call_id = call_id_input;
end;
$$;


--
-- Name: get_current_product_specials(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_product_specials(tenant_id_input uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ps.id,
      'tenantId', ps.tenant_id,
      'productId', ps.product_id,
      'name', ps.name,
      'discount', ps.discount,
      'startDate', ps.start_date,
      'endDate', ps.end_date,
      'isActive', ps.is_active,
      'createdAt', ps.created_at,
      'updatedAt', ps.updated_at
    )
  )
  FROM
    public.product_specials ps
  WHERE
    ps.is_active = true AND
    (ps.start_date IS NULL OR ps.start_date <= CURRENT_TIMESTAMP) AND
    (ps.end_date IS NULL OR ps.end_date >= CURRENT_TIMESTAMP) AND
    (tenant_id_input IS NULL OR ps.tenant_id = tenant_id_input);
$$;


--
-- Name: get_customer_by_id(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_customer_by_id(customer_id_input uuid) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
    customer_record public.customers;
BEGIN
    SELECT *
    INTO customer_record
    FROM public.customers
    WHERE id = customer_id_input;

    IF customer_record IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN jsonb_build_object(
        'id', customer_record.id,
        'tenantId', customer_record.tenant_id, -- Assuming tenant_id exists
        'firstName', customer_record.first_name,
        'lastName', customer_record.last_name,
        'email', customer_record.email,
        'phone', customer_record.phone,
        'company', customer_record.company,
        'addressLine1', customer_record.address, -- Use address column
        'city', customer_record.city,
        'state', customer_record.state,
        'postalCode', customer_record.postal_code,
        'country', customer_record.country,
        'isActive', customer_record.is_active, -- Assuming is_active exists
        'createdAt', customer_record.created_at,
        'updatedAt', customer_record.updated_at
        -- Add any other relevant customer fields here, converting to camelCase
    );
END;
$$;


--
-- Name: get_customer_favorite_product_ids(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_customer_favorite_product_ids(customer_id_input uuid) RETURNS TABLE(product_id uuid)
    LANGUAGE sql STABLE
    AS $$
  SELECT DISTINCT jsonb_array_elements_text(cp.favorites -> 'order_items')::uuid
  FROM customer_preferences cp
  WHERE cp.customer_id = customer_id_input
    AND jsonb_typeof(cp.favorites -> 'order_items') = 'array';
$$;


--
-- Name: get_customer_favorites(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_customer_favorites(customer_id uuid) RETURNS TABLE(product_id uuid, product_name text, product_description text, price numeric, size text, tenant_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE sql STABLE
    AS $$
  select
    p.id as product_id,
    p.name as product_name,
    p.description as product_description,
    p.price,
    p.size,
    p.tenant_id,
    p.created_at,
    p.updated_at
  from
    public.customer_preferences cp
  join
    lateral jsonb_array_elements_text(cp.favorites->'order_items') as order_item_id on true
  join
    public.products p on p.id = order_item_id::uuid
  where
    cp.customer_id = customer_id
    and cp.favorites is not null
    and cp.favorites <> '{}'::jsonb
    and p.is_active = true;
$$;


--
-- Name: get_details_for_products_in_customer_pref(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_details_for_products_in_customer_pref(customer_id_input uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  SELECT jsonb_agg(
    jsonb_build_object(
      'productId', p.id,
      'productName', p.name,
      'productDescription', p.description,
      'price', p.price,
      'size', p.size,
      'tenantId', p.tenant_id,
      'createdAt', p.created_at,
      'updatedAt', p.updated_at
      -- Add other product fields here if needed, converting to camelCase
    )
  )
  FROM
    public.customer_preferences cp
  JOIN
    LATERAL jsonb_array_elements_text(cp.favorites->'orderItems') AS order_item_id ON TRUE -- Assuming 'orderItems' is the camelCase key in JSON
  JOIN
    public.products p ON p.id = order_item_id::uuid
  WHERE
    cp.customer_id = customer_id_input AND
    cp.favorites IS NOT NULL AND
    cp.favorites <> '{}'::jsonb AND
    jsonb_typeof(cp.favorites->'orderItems') = 'array' AND -- Ensure orderItems is an array
    jsonb_array_length(cp.favorites->'orderItems') > 0 AND -- Ensure array is not empty
    p.is_active = true;
$$;


--
-- Name: get_last_order(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_last_order(customer_id_input uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  SELECT jsonb_build_object(
    'id', o.id,
    'tenantId', o.tenant_id,
    'customerId', o.customer_id,
    'proposedDate', CURRENT_TIMESTAMP, -- This seems to be for a new proposed order based on last, so current time
    'status', 'draft', -- Defaulting to draft for a new proposed order
    'total', o.total_amount, -- Using total_amount from the last order
    'orderItems', jsonb_agg(jsonb_build_object(
      'price', oi.price,
      'quantity', oi.quantity,
      'productId', p.id,
      'productName', p.name,
      'productDescription', p.description,
      'productSize', p.size
      -- Add other item fields here if needed, converting to camelCase
    )),
    'lastUpdatedBy', NULL, -- For a new proposed order, these would be null or set by app
    'lastDeviceId', NULL,
    'createdAt', CURRENT_TIMESTAMP, -- For a new proposed order
    'updatedAt', NULL
  ) AS order_details
  FROM
    public.orders o
  JOIN
    public.order_items oi ON oi.order_id = o.id
  JOIN
    public.products p ON p.id = oi.product_id
  WHERE
    o.customer_id = customer_id_input
  GROUP BY
    o.id, o.tenant_id, o.customer_id, o.total_amount -- Group by necessary fields from 'orders' table
  ORDER BY
    o.created_at DESC
  LIMIT 1;
$$;


--
-- Name: get_product_details_by_ids(uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_product_details_by_ids(product_ids_input uuid[]) RETURNS TABLE(id uuid, name text, description text, price numeric, size character varying)
    LANGUAGE sql STABLE
    AS $$
  SELECT p.id, p.name, p.description, p.price, p.size
  FROM products p
  WHERE p.id = ANY(product_ids_input);
$$;


--
-- Name: get_product_specials_by_tenant(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_product_specials_by_tenant(tenant_id_input uuid) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'specialId', ps.id,
                'productId', p.id,
                'productName', p.name,
                'productDescription', p.description,
                'productPrice', p.price,
                'productSize', p.size,
                'productCreatedAt', p.created_at,
                'productUpdatedAt', p.updated_at,
                'discount', ps.discount,
                'startDate', ps.start_date,
                'endDate', ps.end_date
                -- Add other relevant fields here, converting to camelCase
            )
        )
        FROM
            public.product_specials ps
        JOIN
            public.products p ON ps.product_id = p.id
        WHERE
            ps.tenant_id = tenant_id_input
    );
END;
$$;


--
-- Name: get_proposed_order(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_proposed_order(call_id_input uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select jsonb_build_object(
    'id', p.id,
    'tenantId', p.tenant_id,
    'customerId', p.customer_id,
    'callId', p.call_id,             -- This is the column name in the table
    'proposedDate', p.proposed_date,
    'status', p.status,
    'total', p.total,
    'orderItems', p.order_items,
    'lastUpdatedBy', p.last_updated_by,
    'lastDeviceId', p.last_device_id,
    'createdAt', p.created_at,
    'updatedAt', p.updated_at
  )
  from proposed_orders p
  where p.call_id = call_id_input          -- Using the reverted parameter name here
  limit 1;
$$;


--
-- Name: has_role(uuid, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(user_id uuid, role_name text, tenant_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = has_role.user_id
        AND r.name = has_role.role_name
        AND ur.tenant_id = has_role.tenant_id
        AND ur.is_active = true
        AND r.is_active = true
    );
END;
$$;


--
-- Name: FUNCTION has_role(user_id uuid, role_name text, tenant_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.has_role(user_id uuid, role_name text, tenant_id uuid) IS 'Checks if a user has a specific role within a tenant';


--
-- Name: insert_proposed_order(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.insert_proposed_order(order_data jsonb) RETURNS void
    LANGUAGE sql
    AS $$
  insert into proposed_orders (
    id,
    tenant_id,
    customer_id,
    call_id,
    proposed_date,
    status,
    total,
    order_items,
    last_updated_by,
    last_device_id,
    created_at,
    updated_at
  )
  values (
    coalesce((order_data->>'id')::uuid, gen_random_uuid()),
    (order_data->>'tenant_id')::uuid,
    (order_data->>'customer_id')::uuid,
    (order_data->>'call_id')::uuid,
    (order_data->>'proposed_date')::timestamptz,
    (order_data->>'status'),
    (order_data->>'total')::numeric,
    order_data->'order_items',
    null,
    null,
    (order_data->>'created_at')::timestamptz,
    null
  );
$$;


--
-- Name: reset_config(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.reset_config(setting_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE format('RESET %I', setting_name);
END;
$$;


--
-- Name: set_tenant_context(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_tenant_context(tenant_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
END;
$$;


--
-- Name: FUNCTION set_tenant_context(tenant_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.set_tenant_context(tenant_id uuid) IS 'Sets the current tenant context for row-level security policies';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


--
-- Name: set_user_context(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_user_context(user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::text, false);
END;
$$;


--
-- Name: FUNCTION set_user_context(user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.set_user_context(user_id uuid) IS 'Sets the current user context for audit logging';


--
-- Name: update_proposed_order(uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_proposed_order(call_id_input uuid, order_data jsonb) RETURNS void
    LANGUAGE sql
    AS $$
  update proposed_orders
  set
    tenant_id = coalesce((order_data->>'tenant_id')::uuid, tenant_id),
    customer_id = coalesce((order_data->>'customer_id')::uuid, customer_id),
    proposed_date = coalesce((order_data->>'proposed_date')::timestamptz, proposed_date),
    status = coalesce(order_data->>'status', status),
    total = coalesce((order_data->>'total')::numeric, total),
    order_items = coalesce(order_data->'order_items', order_items),
    updated_at = current_timestamp
  where call_id = call_id_input;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: -
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
  DECLARE
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb DEFAULT '{}'::jsonb;
    params jsonb DEFAULT '{}'::jsonb;
    timeout_ms integer DEFAULT 1000;
  BEGIN
    IF url IS NULL OR url = 'null' THEN
      RAISE EXCEPTION 'url argument is missing';
    END IF;

    IF method IS NULL OR method = 'null' THEN
      RAISE EXCEPTION 'method argument is missing';
    END IF;

    IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
      headers = '{"Content-Type": "application/json"}'::jsonb;
    ELSE
      headers = TG_ARGV[2]::jsonb;
    END IF;

    IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
      params = '{}'::jsonb;
    ELSE
      params = TG_ARGV[3]::jsonb;
    END IF;

    IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
      timeout_ms = 1000;
    ELSE
      timeout_ms = TG_ARGV[4]::integer;
    END IF;

    CASE
      WHEN method = 'GET' THEN
        SELECT http_get INTO request_id FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
      WHEN method = 'POST' THEN
        payload = jsonb_build_object(
          'old_record', OLD,
          'record', NEW,
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA
        );

        SELECT http_post INTO request_id FROM net.http_post(
          url,
          payload,
          params,
          headers,
          timeout_ms
        );
      ELSE
        RAISE EXCEPTION 'method argument % is invalid', method;
    END CASE;

    INSERT INTO supabase_functions.hooks
      (hook_table_id, hook_name, request_id)
    VALUES
      (TG_RELID, TG_NAME, request_id);

    RETURN NEW;
  END
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL
);


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: access_phones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_phones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    number text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_access_phones_format CHECK ((number ~ '^\+?[0-9\s\-\(\)]+$'::text))
);


--
-- Name: agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid,
    name text NOT NULL,
    email text,
    phone_number text,
    department text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_agents_phone_format CHECK (((phone_number IS NULL) OR (phone_number ~ '^\+?[0-9\s\-\(\)]+$'::text)))
);


--
-- Name: TABLE agents; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.agents IS 'Customer service agents who handle calls and orders';


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name text NOT NULL,
    action text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    changed_by uuid,
    changed_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.audit_logs IS 'System-wide audit trail for tracking changes';


--
-- Name: call_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.call_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    customer_id uuid,
    agent_id uuid,
    call_date timestamp with time zone DEFAULT now(),
    duration integer,
    purpose public.interaction_purpose,
    outcome public.interaction_outcome,
    status public.interaction_status,
    notes text,
    follow_up_date timestamp with time zone,
    reorder_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE call_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.call_logs IS 'Records of customer interactions via phone';


--
-- Name: customer_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    personal jsonb DEFAULT '{}'::jsonb,
    business jsonb DEFAULT '{}'::jsonb,
    orders jsonb DEFAULT '{}'::jsonb,
    contact_by_enum public.contact_method DEFAULT 'none'::public.contact_method,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    favorites jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT chk_customer_preferences_business_valid_json CHECK (((business IS NULL) OR (jsonb_typeof(business) = 'object'::text))),
    CONSTRAINT chk_customer_preferences_orders_valid_json CHECK (((orders IS NULL) OR (jsonb_typeof(orders) = 'object'::text))),
    CONSTRAINT chk_customer_preferences_personal_valid_json CHECK (((personal IS NULL) OR (jsonb_typeof(personal) = 'object'::text)))
);


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone text,
    address text,
    city text,
    state text,
    postal_code text,
    country text,
    industry_id uuid,
    company text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_customers_phone_format CHECK (((phone IS NULL) OR (phone ~ '^\+?[0-9\s\-\(\)]+$'::text)))
);


--
-- Name: TABLE customers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.customers IS 'Customer information across all tenants';


--
-- Name: COLUMN customers.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.customers.user_id IS 'Reference to a user account when customer is also a user of the system';


--
-- Name: industries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: ip_allowlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ip_allowlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    ip_address cidr NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    content text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid,
    quantity integer NOT NULL,
    price numeric(12,2) NOT NULL,
    discount numeric(12,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    customer_id uuid,
    order_date timestamp with time zone DEFAULT now(),
    total_amount numeric(12,2) DEFAULT 0,
    status text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE orders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.orders IS 'Customer orders placed across the system';


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: product_specials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_specials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    product_id uuid NOT NULL,
    name text NOT NULL,
    discount numeric(10,2),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_product_specials_discount_positive CHECK (((discount IS NULL) OR (discount >= (0)::numeric)))
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    product_type_id uuid,
    category_id uuid,
    price numeric(12,2),
    sku text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    size character varying
);


--
-- Name: TABLE products; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.products IS 'Products available for ordering';


--
-- Name: product_specials_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_specials_view AS
 SELECT ps.id AS special_id,
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_description,
    p.price AS product_price,
    p.size AS product_size,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    ps.discount,
    ps.start_date,
    ps.end_date,
    ps.tenant_id
   FROM (public.product_specials ps
     JOIN public.products p ON ((ps.product_id = p.id)));


--
-- Name: product_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    category_id uuid,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: proposed_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proposed_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    call_id uuid NOT NULL,
    proposed_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    order_items jsonb DEFAULT '[]'::jsonb NOT NULL,
    last_updated_by uuid,
    last_device_id text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT chk_proposed_orders_order_items_valid CHECK ((jsonb_typeof(order_items) = 'array'::text)),
    CONSTRAINT chk_proposed_orders_status_valid CHECK ((status = ANY (ARRAY['draft'::text, 'presented'::text, 'accepted'::text, 'rejected'::text, 'confirmed'::text, 'voice-update'::text, 'ui-update'::text]))),
    CONSTRAINT chk_proposed_orders_total_positive CHECK ((total >= (0)::numeric))
);


--
-- Name: TABLE proposed_orders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.proposed_orders IS 'Temporary storage for draft orders being prepared during customer calls. Acts as a coordination point between different devices.';


--
-- Name: COLUMN proposed_orders.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.id IS 'Primary identifier for the proposed order (UUID).';


--
-- Name: COLUMN proposed_orders.tenant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.tenant_id IS 'The tenant this proposed order belongs to.';


--
-- Name: COLUMN proposed_orders.customer_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.customer_id IS 'The customer for whom this order is being prepared.';


--
-- Name: COLUMN proposed_orders.call_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.call_id IS 'The call during which this order is being prepared, primary search key.';


--
-- Name: COLUMN proposed_orders.proposed_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.proposed_date IS 'The date this order is being proposed for.';


--
-- Name: COLUMN proposed_orders.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.status IS 'Current status of the proposed order (draft, presented, accepted, etc.).';


--
-- Name: COLUMN proposed_orders.total; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.total IS 'The calculated total amount for this proposed order.';


--
-- Name: COLUMN proposed_orders.order_items; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.order_items IS 'JSON array of order items, each containing productId, description, price, quantity, size, and base64 thumbnail.';


--
-- Name: COLUMN proposed_orders.last_updated_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.last_updated_by IS 'The user who last updated this proposed order.';


--
-- Name: COLUMN proposed_orders.last_device_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.last_device_id IS 'Identifier of the device that last updated this order, for conflict resolution.';


--
-- Name: COLUMN proposed_orders.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.created_at IS 'Timestamp when the proposed order was created.';


--
-- Name: COLUMN proposed_orders.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.proposed_orders.updated_at IS 'Timestamp when the proposed order was last updated.';


--
-- Name: proposed_orders_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proposed_orders_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    call_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    data jsonb,
    data_type text
);


--
-- Name: TABLE proposed_orders_data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.proposed_orders_data IS 'Standin for Redis, temporarily holds order, specials and favorites data';


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    permissions jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    domain text,
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_tenants_domain_format CHECK (((domain IS NULL) OR (domain ~ '^[a-zA-Z0-9][a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$'::text)))
);


--
-- Name: TABLE tenants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.tenants IS 'Contains tenant/organization information for multi-tenant setup';


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    personal jsonb DEFAULT '{}'::jsonb,
    business jsonb DEFAULT '{}'::jsonb,
    orders jsonb DEFAULT '{}'::jsonb,
    contact_by_enum public.contact_method DEFAULT 'none'::public.contact_method,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_user_preferences_business_valid_json CHECK (((business IS NULL) OR (jsonb_typeof(business) = 'object'::text))),
    CONSTRAINT chk_user_preferences_orders_valid_json CHECK (((orders IS NULL) OR (jsonb_typeof(orders) = 'object'::text))),
    CONSTRAINT chk_user_preferences_personal_valid_json CHECK (((personal IS NULL) OR (jsonb_typeof(personal) = 'object'::text)))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_roles IS 'Role assignments for users across tenants';


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    email text NOT NULL,
    username text,
    password_hash text,
    last_login timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_users_email_format CHECK ((email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.users IS 'User authentication and identification information across tenants';


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2025_05_19; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_20; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_21; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_22; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_23; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_24; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_05_25; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_05_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: -
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: -
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: -
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: messages_2025_05_19; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_19 FOR VALUES FROM ('2025-05-19 00:00:00') TO ('2025-05-20 00:00:00');


--
-- Name: messages_2025_05_20; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_20 FOR VALUES FROM ('2025-05-20 00:00:00') TO ('2025-05-21 00:00:00');


--
-- Name: messages_2025_05_21; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_21 FOR VALUES FROM ('2025-05-21 00:00:00') TO ('2025-05-22 00:00:00');


--
-- Name: messages_2025_05_22; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_22 FOR VALUES FROM ('2025-05-22 00:00:00') TO ('2025-05-23 00:00:00');


--
-- Name: messages_2025_05_23; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_23 FOR VALUES FROM ('2025-05-23 00:00:00') TO ('2025-05-24 00:00:00');


--
-- Name: messages_2025_05_24; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_24 FOR VALUES FROM ('2025-05-24 00:00:00') TO ('2025-05-25 00:00:00');


--
-- Name: messages_2025_05_25; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_05_25 FOR VALUES FROM ('2025-05-25 00:00:00') TO ('2025-05-26 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_phones access_phones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_phones
    ADD CONSTRAINT access_phones_pkey PRIMARY KEY (id);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: call_logs call_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_pkey PRIMARY KEY (id);


--
-- Name: customer_preferences customer_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preferences
    ADD CONSTRAINT customer_preferences_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: ip_allowlist ip_allowlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_allowlist
    ADD CONSTRAINT ip_allowlist_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: proposed_orders pk_proposed_orders; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposed_orders
    ADD CONSTRAINT pk_proposed_orders PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_specials product_specials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specials
    ADD CONSTRAINT product_specials_pkey PRIMARY KEY (id);


--
-- Name: product_types product_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT product_types_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: proposed_orders_data proposed_orders_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proposed_orders_data
    ADD CONSTRAINT proposed_orders_data_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_tenant_id_key UNIQUE (user_id, role_id, tenant_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_19 messages_2025_05_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_19
    ADD CONSTRAINT messages_2025_05_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_20 messages_2025_05_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_20
    ADD CONSTRAINT messages_2025_05_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_21 messages_2025_05_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_21
    ADD CONSTRAINT messages_2025_05_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_22 messages_2025_05_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_22
    ADD CONSTRAINT messages_2025_05_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_23 messages_2025_05_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_23
    ADD CONSTRAINT messages_2025_05_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_24 messages_2025_05_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_24
    ADD CONSTRAINT messages_2025_05_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_05_25 messages_2025_05_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_05_25
    ADD CONSTRAINT messages_2025_05_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_active_agents_by_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_active_agents_by_tenant ON public.agents USING btree (tenant_id, name) WHERE (is_active = true);


--
-- Name: idx_active_customers_by_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_active_customers_by_tenant ON public.customers USING btree (tenant_id, last_name, first_name) WHERE (is_active = true);


--
-- Name: idx_active_products_by_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_active_products_by_tenant ON public.products USING btree (tenant_id, name) WHERE (is_active = true);


--
-- Name: idx_call_logs_agent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_call_logs_agent ON public.call_logs USING btree (agent_id);


--
-- Name: idx_call_logs_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_call_logs_customer ON public.call_logs USING btree (customer_id);


--
-- Name: idx_call_logs_tenant_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_call_logs_tenant_status ON public.call_logs USING btree (tenant_id, status);


--
-- Name: idx_customers_tenant_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_tenant_email ON public.customers USING btree (tenant_id, lower(email));


--
-- Name: idx_customers_tenant_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_tenant_name ON public.customers USING btree (tenant_id, last_name, first_name);


--
-- Name: idx_customers_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_user_id ON public.customers USING btree (user_id);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_product ON public.order_items USING btree (product_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_tenant_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tenant_status ON public.orders USING btree (tenant_id, status);


--
-- Name: idx_products_tenant_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_category ON public.products USING btree (tenant_id, category_id);


--
-- Name: idx_products_tenant_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_tenant_type ON public.products USING btree (tenant_id, product_type_id);


--
-- Name: idx_proposed_orders_call_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proposed_orders_call_id ON public.proposed_orders USING btree (call_id);


--
-- Name: idx_proposed_orders_items_gin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proposed_orders_items_gin ON public.proposed_orders USING gin (order_items);


--
-- Name: idx_proposed_orders_tenant_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proposed_orders_tenant_customer ON public.proposed_orders USING btree (tenant_id, customer_id);


--
-- Name: idx_user_roles_tenant_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_tenant_role ON public.user_roles USING btree (tenant_id, role_id);


--
-- Name: idx_user_roles_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user ON public.user_roles USING btree (user_id);


--
-- Name: idx_users_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_tenant ON public.users USING btree (tenant_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2025_05_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_19_pkey;


--
-- Name: messages_2025_05_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_20_pkey;


--
-- Name: messages_2025_05_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_21_pkey;


--
-- Name: messages_2025_05_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_22_pkey;


--
-- Name: messages_2025_05_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_23_pkey;


--
-- Name: messages_2025_05_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_24_pkey;


--
-- Name: messages_2025_05_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_05_25_pkey;


--
-- Name: agents tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: call_logs tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.call_logs FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: customers tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: orders tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: products tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: proposed_orders tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.proposed_orders FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: user_roles tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: users tr_audit_log_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_log_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();


--
-- Name: access_phones tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.access_phones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: agents tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: api_keys tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: call_logs tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.call_logs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: customer_preferences tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.customer_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: customers tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: industries tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: ip_allowlist tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.ip_allowlist FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: order_items tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: orders tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_categories tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_specials tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.product_specials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_types tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.product_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: products tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: proposed_orders tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.proposed_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: roles tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: tenants tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_preferences tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_roles tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users tr_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: access_phones access_phones_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_phones
    ADD CONSTRAINT access_phones_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: agents agents_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: agents agents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: api_keys api_keys_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: call_logs call_logs_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id);


--
-- Name: call_logs call_logs_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: call_logs call_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: customer_preferences customer_preferences_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preferences
    ADD CONSTRAINT customer_preferences_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customers customers_industry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_industry_id_fkey FOREIGN KEY (industry_id) REFERENCES public.industries(id);


--
-- Name: customers customers_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: call_logs fk_call_logs_reorder; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT fk_call_logs_reorder FOREIGN KEY (reorder_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: ip_allowlist ip_allowlist_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_allowlist
    ADD CONSTRAINT ip_allowlist_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: orders orders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: product_categories product_categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: product_specials product_specials_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specials
    ADD CONSTRAINT product_specials_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_specials product_specials_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specials
    ADD CONSTRAINT product_specials_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: product_types product_types_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT product_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- Name: product_types product_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT product_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- Name: products products_product_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_type_id_fkey FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: products products_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages Allow all operations for anonymous users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations for anonymous users" ON public.messages TO anon USING (true);


--
-- Name: messages Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations for authenticated users" ON public.messages TO authenticated USING (true);


--
-- Name: access_phones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.access_phones ENABLE ROW LEVEL SECURITY;

--
-- Name: agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

--
-- Name: api_keys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

--
-- Name: call_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: call_logs call_logs_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY call_logs_see_own_data ON public.call_logs FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.user_id = (current_setting('app.current_user_id'::text, true))::uuid))));


--
-- Name: customers customers_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY customers_see_own_data ON public.customers FOR SELECT USING ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: industries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

--
-- Name: ip_allowlist; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ip_allowlist ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: orders orders_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY orders_see_own_data ON public.orders FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.user_id = (current_setting('app.current_user_id'::text, true))::uuid))));


--
-- Name: customer_preferences preferences_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY preferences_see_own_data ON public.customer_preferences FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.user_id = (current_setting('app.current_user_id'::text, true))::uuid))));


--
-- Name: proposed_orders proposed_orders_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY proposed_orders_see_own_data ON public.proposed_orders FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.user_id = (current_setting('app.current_user_id'::text, true))::uuid))));


--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: access_phones tenant_isolation_access_phones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_access_phones ON public.access_phones USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: agents tenant_isolation_agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_agents ON public.agents USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: api_keys tenant_isolation_api_keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_api_keys ON public.api_keys USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: call_logs tenant_isolation_call_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_call_logs ON public.call_logs USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: customers tenant_isolation_customers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_customers ON public.customers USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: ip_allowlist tenant_isolation_ip_allowlist; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_ip_allowlist ON public.ip_allowlist USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: order_items tenant_isolation_order_items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_order_items ON public.order_items USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: orders tenant_isolation_orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_orders ON public.orders USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: product_categories tenant_isolation_product_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_product_categories ON public.product_categories USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: product_specials tenant_isolation_product_specials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_product_specials ON public.product_specials USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: product_types tenant_isolation_product_types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_product_types ON public.product_types USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: products tenant_isolation_products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_products ON public.products USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: proposed_orders tenant_isolation_proposed_orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_proposed_orders ON public.proposed_orders USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: user_roles tenant_isolation_user_roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_user_roles ON public.user_roles USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: users tenant_isolation_users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tenant_isolation_users ON public.users USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));


--
-- Name: user_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences user_preferences_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_preferences_see_own_data ON public.user_preferences FOR SELECT USING ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_see_own_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_see_own_data ON public.users FOR SELECT USING ((id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime messages; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.messages;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

