import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

import { useEffect, useState } from "react";

import "./StudentAnnalytics.css";


function LeaveStatusChart({

    LeaveStatus = {
        Total: 0,
        Approved: 0,
        Rejected: 0,
        Pending: 0
    }

}) {

    const [visible, setVisible] = useState(false);


    useEffect(() => {

        const timer = setTimeout(() => {

            setVisible(true);

        }, 150);


        return () => clearTimeout(timer);

    }, []);


    const {

        Total = 0,

        Approved = 0,

        Rejected = 0,

        Pending = 0

    } = LeaveStatus;


    const leaveData = [

        {
            name: "Approved",

            value: Approved,

            color: "#25D366"

        },

        {
            name: "Pending",

            value: Pending,

            color: "#f7b731"

        },

        {
            name: "Rejected",

            value: Rejected,

            color: "#ff5c5c"

        }

    ].filter(item => item.value > 0);


    const getPercentage = (value) => {

        if (Total === 0) return 0;

        return Math.round((value / Total) * 100);

    };


    return (

        <div
            className={`
                leave-status-container
                ${visible ? "leave-visible" : ""}
            `}
        >


            {Total > 0 ? (

                <>


                    {/* DONUT */}

                    <div
                        className="leave-donut-wrapper"
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie

                                    data={leaveData}

                                    dataKey="value"

                                    nameKey="name"

                                    cx="50%"

                                    cy="50%"

                                    innerRadius="62%"

                                    outerRadius="82%"

                                    paddingAngle={5}

                                    cornerRadius={8}

                                    startAngle={90}

                                    endAngle={-270}

                                    stroke="none"

                                    animationBegin={200}

                                    animationDuration={1100}

                                >

                                    {leaveData.map(

                                        (entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={entry.color}

                                            />

                                        )

                                    )}

                                </Pie>


                                <Tooltip
                                    content={
                                        <LeaveTooltip />
                                    }
                                />

                            </PieChart>

                        </ResponsiveContainer>


                        <div
                            className="leave-center"
                        >

                            <strong>

                                {Total}

                            </strong>


                            <span>

                                Total Leaves

                            </span>

                        </div>

                    </div>


                    {/* STATUS LIST */}

                    <div
                        className="leave-status-list"
                    >

                        <LeaveStatusItem

                            title="Approved"

                            value={Approved}

                            percentage={
                                getPercentage(Approved)
                            }

                            type="approved"

                        />


                        <LeaveStatusItem

                            title="Pending"

                            value={Pending}

                            percentage={
                                getPercentage(Pending)
                            }

                            type="pending"

                        />


                        <LeaveStatusItem

                            title="Rejected"

                            value={Rejected}

                            percentage={
                                getPercentage(Rejected)
                            }

                            type="rejected"

                        />

                    </div>

                </>

            ) : (

                <div
                    className="leave-empty"
                >

                    <div>

                        🗓️

                    </div>


                    <p>

                        No leave applications

                    </p>


                    <span>

                        Leave activity will appear here

                    </span>

                </div>

            )}

        </div>

    );

}


function LeaveStatusItem({

    title,

    value,

    percentage,

    type

}) {

    return (

        <div
            className={`
                leave-status-item
                ${type}
            `}
        >

            <div
                className="leave-status-title"
            >

                <span
                    className="leave-status-dot"
                />


                <span>

                    {title}

                </span>

            </div>


            <strong>

                {value}

            </strong>


            <small>

                {percentage}%

            </small>

        </div>

    );

}


function LeaveTooltip({

    active,

    payload

}) {

    if (

        !active ||

        !payload ||

        !payload.length

    ) {

        return null;

    }


    const item = payload[0].payload;


    return (

        <div
            className="leave-tooltip"
        >

            <div>

                <span
                    className="tooltip-dot"
                    style={{
                        background: item.color
                    }}
                />

                {item.name}

            </div>


            <strong>

                {item.value} leave
                {item.value !== 1 ? "s" : ""}

            </strong>

        </div>

    );

}


export default LeaveStatusChart;