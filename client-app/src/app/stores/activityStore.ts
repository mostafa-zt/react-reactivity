import { makeAutoObservable, reaction, runInAction } from "mobx";
import { activityAxios } from "../api/agent";
import { History } from 'history';
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";
import { craeteAttendee, setActivityProps } from "../common/util/util";
import { toast } from "react-toastify";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

const LIMIT = 3;

export default class ActivityStore {

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistery.clear();
                this.loadActivities();
            }
        )
    }

    activityRegistery = new Map();
    loadingInitial = false;
    selectedActivity: IActivity | null = null;
    loading = false;
    hubConnection: HubConnection | null = null;
    activityCount: number = 0;
    page: number = 0;
    predicate = new Map();
    submitting: boolean = false;

    setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();
        if (predicate !== 'all') {
            this.predicate.set(predicate, value);
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('limit', LIMIT.toString());
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    setPage = (page: number) => {
        this.page = page;
    }

    createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().then(() => console.log(this.hubConnection!.state)).catch(error => console.log('Error establishing connection: ' + error));
        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.selectedActivity!.comments.push(comment);
            })
        })
    }

    stopHubConnetion = () => {
        this.hubConnection!.stop();
    }

    addComment = async (values: any) => {
        values.activityId = this.selectedActivity!.id;
        try {
            // method name
            await this.hubConnection!.invoke('SendComment', values);
        } catch (error) {
        }
    }

    get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistery.values()));
        // return (Array.from(this.activityRegistery.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as IActivity[]);
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort((a, b) =>
            b.date.getTime() - a.date.getTime());

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity]
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activitiesEnvelope = await activityAxios.list(this.axiosParams);
            const { activities, activityCount } = activitiesEnvelope;
            runInAction(() => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistery.set(activity.id, activity);
                });
                this.activityCount = activityCount;
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id) as IActivity;
        // if (activity) {
        //     this.selectedActivity = activity;
        //     return toJS(activity);
        // }
        // else {
        this.loadingInitial = true;
        try {
            activity = await activityAxios.details(id) as IActivity;
            runInAction(() => {
                setActivityProps(activity, this.rootStore.userStore.user!);
                this.selectedActivity = activity;
                this.loadingInitial = false;
            })
            return activity;
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }

    clearActivity = () => {
        this.selectedActivity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistery.get(id);
    }

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await activityAxios.create(activity);
            const attendee = craeteAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.submitting = false;
            })

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            throw error;
        }
    }

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await activityAxios.update(activity);
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.submitting = false;
                this.selectedActivity = activity;
            })
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        try {
            await activityAxios.delete(id);
            runInAction(() => {
                this.activityRegistery.delete(id);
                toast.success('Activity has been deleted successfully');
            })
        } catch (error) {
        }
    }

    closeForm = (history: History) => {
        this.selectedActivity = null;
        history.push('/activities');
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistery.get(id);
    }

    attendActivity = async () => {
        const attendee = craeteAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await activityAxios.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity) {
                    this.selectedActivity.attendees.push(attendee);
                    this.selectedActivity.isGoing = true;
                    this.activityRegistery.set(this.selectedActivity.id, this.selectedActivity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error("Problem signing up to activity");
        }

    }

    cancelAttendance = async () => {
        this.loading = true;
        try {
            await activityAxios.unattend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees.filter(a => a.username !== this.rootStore.userStore.user!.username);
                    this.selectedActivity.isGoing = false;
                    this.activityRegistery.set(this.selectedActivity.id, this.selectedActivity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error("Problem cancelling attendance");
        }
    }
}
