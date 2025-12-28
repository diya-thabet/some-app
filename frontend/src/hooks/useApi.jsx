import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Real Spring Boot Backend API
const API_BASE_URL = 'http://localhost:8080/api/v1';

export function useApi() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generic API call function
    const apiCall = useCallback(async (endpoint, options = {}) => {
        setLoading(true);
        setError(null);

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // ============================================
    // AUTH ENDPOINTS
    // ============================================

    // POST /api/v1/auth/register
    const register = useCallback(async (fullName, phoneNumber, role) => {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                fullName,
                phoneNumber,
                role // CUSTOMER, PROVIDER, ADMIN
            })
        });
    }, [apiCall]);

    // POST /api/v1/auth/authenticate
    const authenticate = useCallback(async (phoneNumber) => {
        return apiCall('/auth/authenticate', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber
            })
        });
    }, [apiCall]);

    // ============================================
    // JOB ENDPOINTS
    // ============================================

    // POST /api/v1/jobs - Create a new job
    const createJob = useCallback(async (jobData) => {
        return apiCall('/jobs', {
            method: 'POST',
            body: JSON.stringify({
                title: jobData.title,
                description: jobData.description,
                budget: jobData.budget,
                latitude: jobData.latitude,
                longitude: jobData.longitude
            })
        });
    }, [apiCall]);

    // GET /api/v1/jobs - Get all jobs (custom endpoint - may need to be added to backend)
    const getJobs = useCallback(async () => {
        try {
            return await apiCall('/jobs', { method: 'GET' });
        } catch (err) {
            // If endpoint doesn't exist, return empty array
            console.warn('Jobs endpoint not available:', err);
            return { success: true, data: [] };
        }
    }, [apiCall]);

    // GET /api/v1/jobs/{jobId} - Get single job
    const getJob = useCallback(async (jobId) => {
        return apiCall(`/jobs/${jobId}`, { method: 'GET' });
    }, [apiCall]);

    // ============================================
    // BID ENDPOINTS
    // ============================================

    // GET /api/v1/jobs/{jobId}/bids
    const getBids = useCallback(async (jobId) => {
        return apiCall(`/jobs/${jobId}/bids`, { method: 'GET' });
    }, [apiCall]);

    // POST /api/v1/jobs/{jobId}/bids
    const placeBid = useCallback(async (jobId, bidData) => {
        return apiCall(`/jobs/${jobId}/bids`, {
            method: 'POST',
            body: JSON.stringify({
                amount: bidData.amount,
                message: bidData.message || ''
            })
        });
    }, [apiCall]);

    // ============================================
    // GEO ENDPOINTS
    // ============================================

    // POST /api/v1/geo/update?lat={lat}&lon={lon}
    const updateLocation = useCallback(async (lat, lon) => {
        return apiCall(`/geo/update?lat=${lat}&lon=${lon}`, {
            method: 'POST'
        });
    }, [apiCall]);

    // GET /api/v1/geo/nearby?lat={lat}&lon={lon}&radius={radius}
    const getNearbyProviders = useCallback(async (lat, lon, radius = 5000) => {
        return apiCall(`/geo/nearby?lat=${lat}&lon=${lon}&radius=${radius}`, {
            method: 'GET'
        });
    }, [apiCall]);

    // ============================================
    // COMMUNITY/STORIES ENDPOINTS
    // ============================================

    // GET /api/v1/community/feed
    const getStories = useCallback(async () => {
        return apiCall('/community/feed', { method: 'GET' });
    }, [apiCall]);

    // POST /api/v1/community/stories
    const postStory = useCallback(async (storyData) => {
        return apiCall('/community/stories', {
            method: 'POST',
            body: JSON.stringify({
                mediaUrl: storyData.mediaUrl,
                caption: storyData.caption
            })
        });
    }, [apiCall]);

    // ============================================
    // CHAT ENDPOINTS
    // ============================================

    // GET /api/v1/chat/history/{jobId}
    const getChatHistory = useCallback(async (jobId) => {
        return apiCall(`/chat/history/${jobId}`, { method: 'GET' });
    }, [apiCall]);

    // POST /api/v1/chat/send
    const sendMessage = useCallback(async (messageData) => {
        return apiCall('/chat/send', {
            method: 'POST',
            body: JSON.stringify({
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                jobId: messageData.jobId,
                content: messageData.content
            })
        });
    }, [apiCall]);

    // ============================================
    // REVIEW ENDPOINTS
    // ============================================

    // POST /api/v1/reviews
    const createReview = useCallback(async (reviewData) => {
        return apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                jobId: reviewData.jobId,
                rating: reviewData.rating,
                comment: reviewData.comment,
                photoUrl: reviewData.photoUrl || null
            })
        });
    }, [apiCall]);

    return {
        loading,
        error,
        apiCall,
        // Auth
        register,
        authenticate,
        // Jobs
        getJobs,
        getJob,
        createJob,
        // Bids
        getBids,
        placeBid,
        // Community
        getStories,
        postStory,
        // Geo
        updateLocation,
        getNearbyProviders,
        // Chat
        getChatHistory,
        sendMessage,
        // Reviews
        createReview
    };
}

export default useApi;
