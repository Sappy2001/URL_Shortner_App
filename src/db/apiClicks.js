import { UAParser } from "ua-parser-js";
import supabase from "./supabase";
//array of url_ids
export async function getClicks(url_ids) {
	//from to get data from a specific table
	//select * for getting all data
	//in here filter the column which value matches with any value of url_ids
	const { data, error } = await supabase
		.from("clicks")
		.select("*")
		.in("url_id", url_ids);
	if (error) {
		console.log(error.message);
		throw new Error("Unable To Load URL");
	}
	return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, original_url }) => {
	try {
		//result of device on link click
		const res = parser.getResult();
		const device = res.type || "desktop";
		const response = await fetch("https://ipapi.co.json");
		const { city, country_name: country } = await response.json();
		//inserting into clicks table
		await supabase.from("clicks").insert({
			url_id: id,
			city,
			device,
			country,
		});
	} catch (err) {
		console.log("error recording click:", err);
		throw new Error("Unable to load clicks");
	} finally {
		//even if there is an error this block runs
		// route user to original url
		window.location.href = original_url;
	}
};

export async function getUrlClicks(url_id) {
	//from to get data from a specific table
	//eq-equals
	const { data, error } = await supabase
		.from("clicks")
		//get all fields
		.select("*")
		//equals to both id and u_id
		.eq("url_id", url_id);

	if (error) {
		console.log(error.message);
		throw new Error("Unable to load stats");
	}
	return data;
}
