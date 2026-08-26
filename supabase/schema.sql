-- ==============================================================================
-- EMPLOYEE MANAGEMENT SYSTEM (EMS) - PRODUCTION SUPABASE SQL SCHEMA
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Admin', 'Employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_status AS ENUM ('Active', 'On Leave', 'Inactive', 'Probation', 'Terminated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('On Time', 'Late', 'Half Day', 'Absent', 'Remote', 'Holiday');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_type_enum AS ENUM ('Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('Open', 'In Progress', 'Resolved', 'Closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE TABLES
-- ==============================================================================

-- 3.1 Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    head_name TEXT,
    head_avatar TEXT,
    budget NUMERIC(12, 2) DEFAULT 0,
    employee_count INTEGER DEFAULT 0,
    location TEXT DEFAULT 'Headquarters',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Profiles (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role DEFAULT 'Employee'::user_role,
    job_title TEXT,
    title TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT,
    phone TEXT,
    location TEXT DEFAULT 'San Francisco, CA (HQ)',
    avatar_url TEXT,
    status employment_status DEFAULT 'Active'::employment_status,
    employment_type TEXT DEFAULT 'Full-time',
    joining_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(10, 2) DEFAULT 0,
    performance_score NUMERIC(3, 1) DEFAULT 4.5,
    manager_name TEXT,
    bio TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    work_hours NUMERIC(4, 2) DEFAULT 0,
    status attendance_status DEFAULT 'On Time'::attendance_status,
    location TEXT DEFAULT 'Office HQ',
    ip_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3.4 Leave Requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type leave_type_enum NOT NULL DEFAULT 'Annual Leave'::leave_type_enum,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL CHECK (days > 0),
    reason TEXT NOT NULL,
    status approval_status DEFAULT 'Pending'::approval_status,
    applied_on TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Leave Balances
CREATE TABLE IF NOT EXISTS public.leave_balances (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    annual_total INTEGER DEFAULT 20,
    annual_used INTEGER DEFAULT 0,
    sick_total INTEGER DEFAULT 10,
    sick_used INTEGER DEFAULT 0,
    casual_total INTEGER DEFAULT 5,
    casual_used INTEGER DEFAULT 0,
    maternity_total INTEGER DEFAULT 90,
    maternity_used INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Support & Helpdesk Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General Inquiry',
    priority ticket_priority DEFAULT 'Medium'::ticket_priority,
    status ticket_status DEFAULT 'Open'::ticket_status,
    description TEXT,
    responses JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Announcements & Bulletins
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'Normal',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT DEFAULT 'HR & Operations',
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Personal Goals & OKRs
CREATE TABLE IF NOT EXISTS public.personal_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Professional Growth',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    target_date DATE,
    status TEXT DEFAULT 'In Progress',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_goals ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'Admin'::public.user_role
    );
END;
$$;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can insert and delete profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Departments Policies
CREATE POLICY "Departments are viewable by authenticated users"
    ON public.departments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage departments"
    ON public.departments FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Attendance Policies
CREATE POLICY "Users can view their own attendance or admin view all"
    ON public.attendance_records FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own attendance punches"
    ON public.attendance_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update their attendance or admin can modify"
    ON public.attendance_records FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- Leave Policies
CREATE POLICY "Users can view their own leaves or admin view all"
    ON public.leave_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can submit leave requests"
    ON public.leave_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can review leave requests or users cancel pending"
    ON public.leave_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- Leave Balances Policies
CREATE POLICY "Users can view their leave balances or admin view all"
    ON public.leave_balances FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage leave balances"
    ON public.leave_balances FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Support Tickets Policies
CREATE POLICY "Users view own tickets or admin view all"
    ON public.support_tickets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create support tickets"
    ON public.support_tickets FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can update tickets"
    ON public.support_tickets FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- Announcements Policies
CREATE POLICY "Announcements are viewable by all authenticated users"
    ON public.announcements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can create/manage announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Authenticated users can create audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Personal Goals Policies
CREATE POLICY "Users view own goals or admin view all"
    ON public.personal_goals FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage their personal goals"
    ON public.personal_goals FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 5. AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    assigned_role public.user_role := 'Employee'::public.user_role;
    user_full_name TEXT;
BEGIN
    IF (NEW.raw_user_meta_data->>'role') = 'Admin' OR NEW.email LIKE '%admin%' THEN
        assigned_role := 'Admin'::public.user_role;
    END IF;

    user_full_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

    INSERT INTO public.profiles (
        id,
        employee_id,
        name,
        email,
        role,
        job_title,
        title,
        avatar_url,
        status
    )
    VALUES (
        NEW.id,
        'EMP-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
        user_full_name,
        NEW.email,
        assigned_role,
        COALESCE(NEW.raw_user_meta_data->>'jobTitle', CASE WHEN assigned_role = 'Admin' THEN 'Administrator' ELSE 'Team Member' END),
        COALESCE(NEW.raw_user_meta_data->>'jobTitle', CASE WHEN assigned_role = 'Admin' THEN 'Administrator' ELSE 'Team Member' END),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&dpr=2&q=80'),
        'Active'::public.employment_status
    )
    ON CONFLICT (id) DO NOTHING;

    -- Initialize leave balance for user
    INSERT INTO public.leave_balances (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. SEED INITIAL DEPARTMENTS & DATA
-- ==============================================================================

INSERT INTO public.departments (name, code, head_name, budget, employee_count, description)
VALUES
    ('Engineering & Technology', 'ENG', 'Alex Morgan', 450000.00, 24, 'Core platform development, DevOps, and infrastructure.'),
    ('Product & UX Design', 'PROD', 'Sarah Jenkins', 280000.00, 12, 'Product strategy, wireframing, and user research.'),
    ('Human Resources & People', 'HR', 'Michael Chang', 150000.00, 6, 'Talent acquisition, culture, payroll, and benefits.'),
    ('Marketing & Growth', 'MKT', 'Emily Rodriguez', 220000.00, 10, 'Brand awareness, digital campaigns, and community.'),
    ('Finance & Accounting', 'FIN', 'David Kim', 180000.00, 5, 'Financial forecasting, tax compliance, and auditing.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.announcements (title, content, category, priority, author_name, pinned)
VALUES
    ('Annual Company Retreat 2026', 'We are excited to announce our upcoming annual retreat in Lake Tahoe from Oct 12-16. Please confirm your dietary requirements in your profile.', 'Company Update', 'High', 'HR Team', true),
    ('Q3 Performance Review Cycle Open', 'Self-evaluations for Q3 are now active in the performance portal. Please submit your reviews before Friday 5:00 PM.', 'Performance', 'Urgent', 'Alex Morgan', true),
    ('New Health & Wellness Stipend Policy', 'Starting next month, all full-time team members are eligible for a $150 monthly wellness reimbursement. Details in the benefits guide.', 'Benefits', 'Normal', 'People Ops', false)
ON CONFLICT DO NOTHING;
