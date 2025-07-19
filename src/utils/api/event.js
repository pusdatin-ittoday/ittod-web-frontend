import instance from "../../api/axios";

export const registerEvent = async ({
	eventId,
	institutionName,
	phoneNumber,
}) => {
	try {
		const res = await instance.post("/api/event/join", {
			event_id: eventId,
			institution_name: institutionName,
			phone_number: phoneNumber,
		});

		return res;
	} catch (error) {
		// HandleNotifError(error);
		console.error("Error fetching data:", error);
		throw error;
	}
};

export const getJoinEvent = async () => {
	try {
		const res = await instance.get("/api/event");

		return res;
	} catch (error) {
		// HandleNotifError(error);
		console.error("Error fetching data:", error);
		throw error;
	}
};
