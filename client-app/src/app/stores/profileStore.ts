import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import {profileAxios} from "../api/agent";
import { IPhoto, IProfile, IUserActivity } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    profile: IProfile | null = null;
    loadingProfile: boolean = true;
    uploadingPhoto: boolean = false;
    loading: boolean = false;
    followings: IProfile[] = [];
    activeTab: number = 0;
    userActivities: IUserActivity[] = [];
    loadingActivities = false;

    get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }
        else {
            return false;
        }
    }

    loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await profileAxios.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            });
        } catch (error) {
            toast.error('Problem loading activities');
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    setActiveTab = (activeTabIndex: number) => {
        this.activeTab = activeTabIndex;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await profileAxios.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            });
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await profileAxios.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch (error) {
            toast.error("Problem uploading photo");
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await profileAxios.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error) {
            toast.error("Problem setting photo as main");
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await profileAxios.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            toast.error('Probelm deleting the photo');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    upadteProfile = async (profile: Partial<IProfile>) => {
        try {
            await profileAxios.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
                    this.rootStore.userStore.user!.displayName = profile.displayName!;
                }
                this.profile = { ...this.profile!, ...profile };
            })
        } catch (error) {
            toast.error('Problem updating profile');
        }
    }

    follow = async (username: string) => {
        this.loading = true;
        try {
            await profileAxios.follow(username);
            runInAction(() => {
                this.profile!.isFollowed = true;
                this.profile!.followerCount++;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem following user: ' + error.data.errors);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    unfollow = async (username: string) => {
        this.loading = true;
        try {
            await profileAxios.unfollow(username);
            runInAction(() => {
                this.profile!.isFollowed = false;
                this.profile!.followerCount--;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem unfollowing user: ' + error.data.errors);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await profileAxios.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem loading followings');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}