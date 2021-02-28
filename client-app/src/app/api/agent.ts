import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivityEnvelope } from '../models/activity';
import { history } from '../..'
import { toast } from 'react-toastify';
import { IUser, IUserFromValues } from '../models/user';
import { IPhoto, IProfile } from '../models/profile';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    const { status, data, config, headers } = error.response;
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error, make sure API is running.');
    }
    if (status === 404) {
        history.push('/notfound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }
    if (status === 500) {
        toast.error(`Server Error - ${data.errors}`);
    }
    if (status === 401 && headers.hasOwnProperty('www-authenticate')) {
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your sesstion has expired, please login again.');
    }
    throw error.response;
})

const responseBody = (response: AxiosResponse) => response.data;

// const sleep = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(responseBody)
    }
};

const Activities = {
    // list: (limit?: number, page?: number): Promise<IActivityEnvelope> => request.get(`/activities/list?limit=${limit}&offset=${page ? page * limit! : 0}`),
    list: (params: URLSearchParams): Promise<IActivityEnvelope> => axios.get('/activities/list', { params: params }).then(responseBody),
    details: (id: string) => request.get(`/activities/details/${id}`),
    create: (activity: IActivity) => request.post('/activities/create', activity),
    update: (activity: IActivity) => request.put(`/activities/edit/${activity.id}`, activity),
    delete: (id: string) => request.del(`/activities/delete/${id}`),
    attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => request.del(`/activities/${id}/unattend`)
};

const User = {
    current: (): Promise<IUser> => request.get('/user/currentuser'),
    login: (user: IUserFromValues): Promise<IUser> => request.post('/user/login', user),
    register: (user: IUserFromValues): Promise<IUser> => request.post('/user/register', user)
};

const Profiles = {
    get: (username: string): Promise<IProfile> => request.get(`/profile/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => request.postForm('/photo', photo),
    setMainPhoto: (id: string) => request.post(`/photo/${id}/setmain`, {}),
    deletePhoto: (id: string) => request.del(`/photo/${id}/delete`),
    updateProfile: (profile: Partial<IProfile>) => request.put('/user/edit', profile),
    follow: (username: string) => request.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => request.del(`/profiles/${username}/unfollow`),
    listFollowings: (username: string, predicate: string) => request.get(`/profiles/${username}/following?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => request.get(`/profile/${username}/activities?predicate=${predicate}`)
}

export { Activities as activityAxios , User as userAxios, Profiles as profileAxios }
