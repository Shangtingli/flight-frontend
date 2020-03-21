/**
 * Define every action possible for the project to manage states in the store
 * For the meaning of each action, see the reducers/index.js
 **/

export const nextStep = (data) => ({
    type: "NEXT_STEP",
    data: data
});

export const switchRegisterEntry = (email,phoneNumber) => ({
    type: "SWITCH_TO_REGISTER",
    email: email,
    phoneNumber: phoneNumber
})


export const fillFeatures = (data) => ({
    type: "FILL_FEATURES",
    data: data
})

export const switchLoginEntry = (email,phoneNumber) => ({
    type: "SWITCH_TO_LOGIN",
    email: email,
    phoneNumber: phoneNumber
})

export const logout = {
    type: "LOGOUT"
};

export const changeTab = (tab) => ({
    type: "CHANGE_TAB",
    tab : tab
})


export const writeStoresFromDatabase = (data) => ({
    type: "WRITE_STORES_FROM_DATABASE",
    data: data
})

export const writeCommentsFromDatabase = (data) => ({
    type: "WRITE_COMMENTS_FROM_DATABASE",
    data: data
})

export const writeTravellersFromDatabase = (data) => ({
    type: "WRITE_TRAVELLERS_FROM_DATABASE",
    data: data
})