import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Mock data for demo
const MOCK_JOBS = [
    {
        id: 1,
        title: 'إصلاح تسرب المياه في الحمام',
        description: 'عندي تسرب مياه في الحمام، نحب حد يجي يصلحو اليوم إذا ممكن. المشكلة في الصنبور الرئيسي.',
        category: 'Plumbing',
        budget: 50,
        status: 'OPEN',
        customer: { id: 2, fullName: 'سارة المنصوري', verified: true },
        latitude: 36.8065,
        longitude: 10.1815,
        createdAt: '2025-12-28T10:00:00Z'
    },
    {
        id: 2,
        title: 'دروس رياضيات للباكالوريا',
        description: 'نحب معلم رياضيات للتحضير للباكالوريا. 3 حصص في الأسبوع.',
        category: 'Tutoring',
        budget: 80,
        status: 'OPEN',
        customer: { id: 3, fullName: 'محمد الغربي', verified: true },
        latitude: 36.8189,
        longitude: 10.1658,
        createdAt: '2025-12-27T15:30:00Z'
    },
    {
        id: 3,
        title: 'تنظيف شقة قبل العيد',
        description: 'شقة 3 غرف تحتاج تنظيف عميق. نحب التنظيف يشمل النوافذ والمطبخ.',
        category: 'Cleaning',
        budget: 120,
        status: 'IN_PROGRESS',
        customer: { id: 4, fullName: 'فاطمة البجاوي', verified: false },
        latitude: 36.7965,
        longitude: 10.1814,
        createdAt: '2025-12-26T09:00:00Z'
    },
    {
        id: 4,
        title: 'صباغة غرفة نوم',
        description: 'غرفة 4x5 متر تحتاج صباغة جديدة. اللون أبيض.',
        category: 'Painting',
        budget: 200,
        status: 'OPEN',
        customer: { id: 5, fullName: 'يوسف الصفاقسي', verified: true },
        latitude: 36.8100,
        longitude: 10.1700,
        createdAt: '2025-12-28T08:00:00Z'
    }
];

const MOCK_STORIES = [
    {
        id: 1,
        user: { id: 1, fullName: 'أحمد بن علي', verified: true },
        mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
        caption: 'خدمة سباكة اليوم في المرسى! العميل راضي والحمد لله 🔧💪',
        createdAt: '2025-12-28T14:00:00Z'
    },
    {
        id: 2,
        user: { id: 6, fullName: 'خديجة العروسي' },
        mediaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        caption: 'تنظيف فيلا كاملة! 6 ساعات خدمة متواصلة 🧹✨',
        createdAt: '2025-12-27T18:30:00Z'
    }
];

const MOCK_BIDS = [
    { id: 1, jobId: 1, provider: { id: 1, fullName: 'أحمد بن علي', verified: true, fairnessScore: 85 }, amount: 45, message: 'متوفر الآن، نجي في نص ساعة', accepted: false },
    { id: 2, jobId: 1, provider: { id: 7, fullName: 'منير السوسي', verified: true, fairnessScore: 78 }, amount: 55, message: 'عندي خبرة 10 سنين في السباكة', accepted: false }
];

export function useApi() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const apiCall = useCallback(async (endpoint, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Jobs API
    const getJobs = useCallback(() => {
        // Return mock data for demo
        return Promise.resolve({ success: true, data: MOCK_JOBS });
    }, []);

    const getJob = useCallback((jobId) => {
        const job = MOCK_JOBS.find(j => j.id === parseInt(jobId));
        return Promise.resolve({ success: true, data: job });
    }, []);

    const createJob = useCallback((jobData) => {
        const newJob = {
            id: Date.now(),
            ...jobData,
            status: 'OPEN',
            createdAt: new Date().toISOString()
        };
        MOCK_JOBS.unshift(newJob);
        return Promise.resolve({ success: true, data: newJob });
    }, []);

    // Bids API
    const getBids = useCallback((jobId) => {
        const bids = MOCK_BIDS.filter(b => b.jobId === parseInt(jobId));
        return Promise.resolve({ success: true, data: bids });
    }, []);

    const placeBid = useCallback((jobId, bidData) => {
        const newBid = {
            id: Date.now(),
            jobId: parseInt(jobId),
            ...bidData,
            accepted: false,
            createdAt: new Date().toISOString()
        };
        MOCK_BIDS.push(newBid);
        return Promise.resolve({ success: true, data: newBid });
    }, []);

    // Community API
    const getStories = useCallback(() => {
        return Promise.resolve({ success: true, data: MOCK_STORIES });
    }, []);

    const postStory = useCallback((storyData) => {
        const newStory = {
            id: Date.now(),
            ...storyData,
            createdAt: new Date().toISOString()
        };
        MOCK_STORIES.unshift(newStory);
        return Promise.resolve({ success: true, data: newStory });
    }, []);

    // Geo API
    const updateLocation = useCallback((lat, lon) => {
        return Promise.resolve({ success: true });
    }, []);

    const getNearbyProviders = useCallback((lat, lon, radius = 5000) => {
        return Promise.resolve({ success: true, data: [] });
    }, []);

    // Chat API
    const getChatHistory = useCallback((jobId) => {
        return Promise.resolve({ success: true, data: [] });
    }, []);

    const sendMessage = useCallback((messageData) => {
        return Promise.resolve({ success: true, data: messageData });
    }, []);

    // Reviews API
    const createReview = useCallback((reviewData) => {
        return Promise.resolve({ success: true, data: reviewData });
    }, []);

    return {
        loading,
        error,
        apiCall,
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
