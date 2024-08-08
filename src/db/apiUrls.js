import { UAParser } from "ua-parser-js";
import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(u_id) {
	//from to get data from a specific table
	//select * for getting all data
	//eq-equals
	const { data, error } = await supabase
		.from("urls")
		.select("*")
		.eq("user_id", u_id);
	if (error) {
		console.log(error.message);
		throw new Error("Unable To Load URL");
	}
	return data;
}

export async function deleteUrl(id) {
	//from to get data from a specific table
	//eq-equals
	const { data, error } = await supabase.from("urls").delete().eq("id", id);
	if (error) {
		console.log(error.message);
		throw new Error("Unable To Load URL");
	}
	return data;
}

export async function createUrl(
	{ title, longUrl, customUrl, user_id },
	qrCode
) {
	console.log(title, longUrl, customUrl, user_id, qrCode);
	//from to get data from a specific table
	//eq-equals
	//toString will give string representation of random value
	//substring will take char from 2-6
	const short_url = Math.random().toString(36).substring(2, 6);
	const fileName = `qr-${short_url}`;

	//uploading qr code
	const { error: storageError } = await supabase.storage
		//finding the fieldName qrs
		.from("qrs")
		//adding fileName & doc to upload
		.upload(fileName, qrCode);
	if (storageError) {
		throw new Error(storageError.message);
	}
	const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
	const { data, error } = await supabase
		//finding field url
		.from("urls")
		//inserting the objects
		.insert({
			title,
			original_url: longUrl,
			//if not present then null
			custom_url: customUrl || null,
			short_url,
			user_id,
			qr,
		})
		//getting data that is inserted
		.select();
	if (error) {
		console.log(error);
		throw new Error("error creating short url");
	}
	return data;
}

//getting original url
export async function getLongUrl(id) {
	//from to get data from a specific table
	//eq-equals
	const { data, error } = await supabase
		.from("urls")
		//get this fields
		.select("id,original_url")
		//checks id equal to short or custom url
		.or(`short_url.eq.${id},custom_url.eq.${id}`)
		//return single row
		.single();
	if (error) {
		console.log(error.message);
		throw new Error("Unable To Load URL");
	}
	return data;
}

//info about that particular url
export async function getUrl({ id, user_id }) {
	console.log(id, user_id);
	//from to get data from a specific table
	//eq-equals
	const { data, error } = await supabase
		.from("urls")
		//get all fields
		.select("*")
		//equals to both id and u_id
		.eq("id", id)
		.eq("user_id", user_id)
		//this will return array data until we use single()
		.single();

	if (error) {
		console.log(error.message);
		throw new Error("Short UrL not found");
	}
	console.log(data.title);
	return data;
}
