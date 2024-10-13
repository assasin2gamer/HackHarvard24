import React, { useEffect, useState } from "react";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
import Chart from "react-apexcharts";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import RepeatIcon from '@mui/icons-material/Repeat';
import HotelIcon from '@mui/icons-material/Hotel';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SpeedIcon from '@mui/icons-material/Speed';
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PromptBox from "components/PromptBox/PromptBox.js";
import Prediction from "components/Predictions/Predictions.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {

  const classes = useStyles();

  const [curHeartRate, setCurHeartRate] = useState(null)
  const [curSleep, setCurSleep] = useState(null)
  const [curBloodPressure, setCurBloodPressure] = useState(null)
  const [curAvgCycle, setCurAvgCycle] = useState(null)

  const [heartRateData, setHeartRateData] = useState({
    options: {
      chart: {
        id: "heart-rate-chart",
        animateGradually: {
          enabled: true,
          delay: 150, // Gradual line animation
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350, // Animation speed for dynamic updates
        },
        toolbar: {
          show: false,
        },
        zoom: {
          autoScaleYaxis: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime", // Handles UNIX timestamps in milliseconds
        labels: {
          datetimeUTC: false, // Display dates in local time
          style: {
            colors: "#000000",
            fontSize: "10px",
          },
          formatter: function (value) {
            return new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }); // Format to display only the time
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#000", // Black text color for tooltip
        },
        x: {
          format: "dd MMM yyyy, HH:mm", // Display date and time
        },
        y: {
          formatter: (value) => `Heart Rate: ${value} bpm`, // Tooltip format for value
        },
      },
      title: {
        text: "Heart Rate (BPM)",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      stroke: {
        curve: 'smooth',  // Optional: makes the line smooth
        colors: ["#FEFCEC"], // Set the color of the line here (e.g., "#FF5733" for orange)
        width: 3, // Optional: set the line thickness
      },
    },
    series: [
      {
        name: "Heart Rate (BPM)",
        data: [], // Heart rate values
      },
    ],
  });
  
  

  const [sleepData, setSleepData] = useState({
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          colors: {
            ranges: [{
              from: 0,
              to: 1000,
              color: "#FEFCEC" // Set the color you want for bars (e.g., Dodger Blue)
            }]
          },
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: "datetime", // Handles UNIX timestamps in milliseconds
        labels: {
          datetimeUTC: false, // Display dates in local time
          style: {
            colors: "#000000",
            fontSize: "10px",
          },
          formatter: function (value) {
            return new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }); // Format to display only the time
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        forceNiceScale: true,
        labels: {
          formatter: function (val) {
            return Math.round(val); // Round to integer
          },
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#000", // Black text color for tooltip
        },
        x: {
          format: "dd MMM yyyy, HH:mm", // Display date and time
        },
        y: {
          formatter: (value) => `Heart Rate: ${value} bpm`, // Tooltip format for value
        },
      },
      title: {
        text: "Sleep Duration",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
    },
    series: [
      {
        name: "Sleep Duration (hrs)",
        data: [],
      },
    ],
  });

  const fetchData = async () => {
    try {
      const response = await fetch("http://54.165.183.89:22099/get");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Log the fetched data
      console.log("Fetched data:", data);

      // Assuming data contains heartRate and sleep arrays
      if (data.heartArr && data.sleep) {
        const currentTime = new Date().toLocaleTimeString();

        setCurHeartRate(data.heartArr[data.heartArr.length - 1])
        setCurSleep(data.sleep[data.sleep.length - 1])
        // TODO add blood pressure
        setCurAvgCycle(data.averageCycle[data.averageCycle.length - 1])


        // Update heart rate data
        // setHeartRateData((prevState) => {
        //   const newData = [
        //     ...prevState.series[0].data,
        //     [Date.now(), data.heartArr[data.heartArr.length - 1].value],
        //   ];
        
        //   return {
        //     ...prevState,
        //     series: [
        //       {
        //         name: "Heart Rate",
        //         data: newData, // Updated to include all heart rate data points in series
        //       },
        //     ],
        //   };
        // });

        setHeartRateData((prevOptions) => ({
          ...prevOptions,
          series: [
            {
              name: "Heart Rate",
              data: [...prevOptions.series[0].data, [Date.now(), data.heartArr[data.heartArr.length - 1]]],
            },
          ],
        }));

        setSleepData((prevOptions) => ({
          ...prevOptions,
          series: [
            {
              name: "Sleep Data",
              data: [...prevOptions.series[0].data, [Date.now(), data.sleep[data.sleep.length - 1]]],
            },
          ],
        }));
        
        // // update sleepData
        // setSleepData((prevState) => {
        //   const newData = [
        //     ...prevState.series[0].data,
        //     [Date.now(), data.sleep[data.sleep.length - 1].duration],
        //   ];
        
        //   return {
        //     ...prevState,
        //     series: [
        //       {
        //         name: "Sleep Duration (hrs)",
        //         data: newData, // Updated to include all sleep data points in series
        //       },
        //     ],
        //   };
        // });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch data every 20 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // useEffect to log heartRateData
  useEffect(() => {
    console.log("Updated Heart Rate Data:", heartRateData);
  }, [heartRateData]);

  // useEffect to log sleepData
  useEffect(() => {
    console.log("Updated Sleep Data:", sleepData);
  }, [sleepData]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <RepeatIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Current Average Cycle</p>
              <h3 className={classes.cardTitle}>
               {curAvgCycle ? curAvgCycle.toFixed(2) : "N/A"} <small>[units]</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <Warning />
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Get more space
                </a>
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <HotelIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current Sleep Duration</p>
              <h3 className={classes.cardTitle}> {curSleep ? curSleep.toFixed(2) : "N/A"} <small> hours</small> </h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <MonitorHeartIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Current Heart Rate</p>
              <h3 className={classes.cardTitle}>{curHeartRate ? curHeartRate : "N/A"} <small> BPM</small></h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <SpeedIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current Blood Presure</p>
              <h3 className={classes.cardTitle}><small>mmHg</small></h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <Update />
                Just Updated
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <div style={{display:'flex', width:'100vw'}}>
      <GridContainer style={{width:'50%', margin:'0'}}>
        <Prediction/>
      </GridContainer>

      <GridContainer style={{width:'40vw', margin:'0', display:'flex'}}>
        {/* Heart Rate Data Chart */}
        <div style={{width:'34vw'}}>
          <Card chart>
            <CardHeader color="info">
              <Chart
                options={heartRateData.options}
                series={heartRateData.series}
                type="line"
                height={190}
              />
            </CardHeader>
            
            <CardFooter chart>
              {/* <div className={classes.stats}>
                <AccessTime /> updated {new Date().toLocaleTimeString()}
              </div> */}
            </CardFooter>
          </Card>
        </div>
        {/* Sleep Data Chart */}
        <div style={{width:'34vw'}}>
          <Card chart>
            <CardHeader color="info">
              <Chart
                options={sleepData.options}
                series={sleepData.series}
                type="bar"
                height={190}
              />
            </CardHeader>
            
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated {new Date().toLocaleTimeString()}
              </div>
            </CardFooter>
          </Card>
        </div>
      </GridContainer>
      </div>
      
      {/* <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}
    </div>
  );
}
