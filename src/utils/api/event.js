import Api from "../Api";

export const registerEvent = async ({eventId, intitutionName, phoneNumber}) => {
    try {
        const res = await Api.post("/api/event/join", {

            "event_id": eventId,
            "institution_name": intitutionName,
            "phone_number": phoneNumber

        });

        return res;
    } catch (error) {
        // HandleNotifError(error);
        console.error("Error fetching data:", error);
        throw error;
    }
}

export const getJoinEvent = async () => {
    try {
        const res = await Api.get("/api/event");

        return res;
    } catch (error) {
        // HandleNotifError(error);
        console.error("Error fetching data:", error);
        throw error;
    }
}