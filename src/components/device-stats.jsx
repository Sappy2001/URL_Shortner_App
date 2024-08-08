import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const DeviceStats = ({ stats }) => {
	//taking the deviceName from object and counting it
	const deviceCount = stats.reduce((acc, item) => {
		//if device is more than one the deviceValue+1
		if (acc[item.device]) acc[item.device]++;
		// if device came 1st time deviceValue 1
		else {
			acc[item.device] = 1;
		}
		return acc;
	}, {});

	console.log(deviceCount);
	//Object.entries converts obj to arr like [device,count]
	//array.map will convert it to arr of objects  : [{device:"deviceName",count:number}]
	const devices = Object.entries(deviceCount).map(([device, count]) => ({
		device,
		count,
	}));

	console.log(devices);
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart width={400} height={400}>
					<Pie
						className="flex flex-col"
						data={devices}
						//fixed used not to use decimal
						label={({ device, percent }) =>
							`${device}: ${(percent * 100).toFixed(0)}%`
						}
						labelLine={false}
						// label={renderCustomizedLabel}
						dataKey="count"
					>
						{devices.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DeviceStats;
