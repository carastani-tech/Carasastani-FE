import { useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ── Storage keys ──────────────────────────────────────────────
const SESSION_ID_KEY = 'carastani_session_id';
const LAST_ACTIVITY_KEY = 'carastani_last_activity';
const VISIT_TRACKED_KEY = 'carastani_visit_tracked';

// ── Config ────────────────────────────────────────────────────
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'];

// ── Helpers ───────────────────────────────────────────────────

/** Get or create a session ID in sessionStorage */
const getOrCreateSessionId = () => {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
};

/** Reset the session: new ID, clear tracked flag */
const resetSession = () => {
    const newId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, newId);
    sessionStorage.removeItem(VISIT_TRACKED_KEY);
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    return newId;
};

/** Check whether the session has been inactive for 30 min */
const isSessionExpired = () => {
    const last = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    if (!last) return false;
    return Date.now() - parseInt(last, 10) > INACTIVITY_TIMEOUT_MS;
};

/** Update the last-activity timestamp */
const touchActivity = () => {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

// ── POST visit ────────────────────────────────────────────────

const sendVisit = async (sessionId) => {
    try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:9091/api/v1';
        await fetch(`${apiBase}/analytics/visit`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                page: window.location.pathname.replace(/^\//, ''),
                timestamp: new Date().toISOString(),
            }),
        });
        sessionStorage.setItem(VISIT_TRACKED_KEY, 'true');
    } catch (error) {
        console.error('Visit tracking failed:', error);
    }
};

// ── Hook ──────────────────────────────────────────────────────

/**
 * Tracks user visits with full session management:
 *  1. Generates a unique sessionId (stored in sessionStorage)
 *  2. Sends a POST /analytics/visit once per session
 *  3. Tracks user activity (click, scroll, mousemove, etc.)
 *  4. If inactive for 30 min → expires session, generates new ID, re-sends visit
 */
const useVisitorTracker = () => {
    const activityTimerRef = useRef(null);

    // ── Handle activity & timeout check ───────────────────────
    const handleActivity = useCallback(() => {
        // If session expired due to inactivity, start a fresh session
        if (isSessionExpired()) {
            const newId = resetSession();
            sendVisit(newId);
            return;
        }
        touchActivity();
    }, []);

    useEffect(() => {
        // 1. Get or create session
        let sessionId = getOrCreateSessionId();

        // 2. Check if returning from inactivity timeout
        if (isSessionExpired()) {
            sessionId = resetSession();
        }

        // 3. Record initial activity timestamp
        touchActivity();

        // 4. Send visit if not already tracked this session
        if (!sessionStorage.getItem(VISIT_TRACKED_KEY)) {
            sendVisit(sessionId);
        }

        // 5. Listen for user activity
        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, handleActivity, { passive: true })
        );

        // 6. Periodically check for inactivity (every 60 s)
        activityTimerRef.current = setInterval(() => {
            if (isSessionExpired()) {
                const newId = resetSession();
                sendVisit(newId);
            }
        }, 60_000);

        return () => {
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            );
            if (activityTimerRef.current) {
                clearInterval(activityTimerRef.current);
            }
        };
    }, [handleActivity]);
};

export default useVisitorTracker;
