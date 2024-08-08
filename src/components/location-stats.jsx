import React from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const LocationStats = ({ stats }) => {
	//taking the cityname from object and counting it
	const cityCount = stats.reduce((acc, item) => {
		//if city is more than one the cityValue+1
		if (acc[item.city]) acc[item.city]++;
		// if city came 1st time cityValue 1
		else {
			acc[item.city] = 1;
		}
		return acc;
	}, {});
	console.log(cityCount);

	//Object.entries converts obj to arr like [city,count]
	//array.map will convert it to arr of objects  : [{city:"cityName",count:number}]
	const cities = Object.entries(cityCount).map(([city, count]) => ({
		city,
		count,
	}));

	console.log(cities);
	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer>
				<LineChart
					width={700}
					height={300}
					//taking 1st 5 items
					data={cities.slice(0, 5)}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<XAxis dataKey="city" />
					<YAxis />
					<Tooltip labelStyle={{ color: "green" }} />
					<Legend />
					<Line type="monotone" dataKey="count" stroke="#8884d8" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default LocationStats;
