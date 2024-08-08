import supabase, { supabaseUrl } from "./supabase";

//login logic
export async function login({ email, password }) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw new Error(error.message);
	return data;
}

//user present logic
export async function getCurrentUser() {
	const { data, error } = await supabase.auth.getSession();
	if (!data.session) return null;
	if (error) throw new Error(error.message);

	//if data.session  has user obj
	return data.session?.user;
}

//signup logic
export async function signup({ name, password, email, profile_pic }) {
	//filename:dp-sappy-modak-2331
	const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
	//uploading file in profile_pic
	const { error: storageError } = await supabase.storage
		//getting the fieldname from the storage where we will upload
		.from("profile_pic")
		.upload(fileName, profile_pic);
	if (storageError) {
		throw new Error(storageError.message);
	}
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		//for providing additional info
		options: {
			data: {
				name,
				profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
			},
		},
	});
	if (error) throw new Error(error.message);
	return data;
}

export async function signOut() {
	const { data, error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}
