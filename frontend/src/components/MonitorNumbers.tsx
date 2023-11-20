import React from "react";
import {
  Box,
  Grid,
  Paper,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { detailType } from "../slices/receptionSlice";

type Props = {
  details: detailType[];
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const MonitorNumbers: React.FC<Props> = ({ details }) => {
  let on_off_times = details.reduce((a, b) => a + b.on_off_times, 0);
  let dispatch_times = details.reduce((a, b) => a + b.dispatch_times, 0);
  let detail_times = details.reduce((a, b) => a + b.detail_times, 0);
  let temperature_times = details.reduce((a, b) => a + b.temperature_times, 0);
  let mode_times = details.reduce((a, b) => a + b.mode_times, 0);
  let request_time = parseFloat(
    details.reduce((a, b) => a + b.request_time, 0).toFixed(1),
  );

  const round2 = (n: number) => {
    return Math.round(n * 100) / 100;
  };

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 9999,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.on_off_times),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">开关次数</Typography>
                {on_off_times !== undefined && on_off_times !== null ? (
                  <Typography variant="h4">
                    {on_off_times.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mx={1}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.dispatch_times),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">调度次数</Typography>
                {dispatch_times !== undefined && dispatch_times !== null ? (
                  <Typography variant="h4">
                    {dispatch_times.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mx={1}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.detail_times),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">详单条数</Typography>
                {detail_times !== undefined && detail_times !== null ? (
                  <Typography variant="h4">
                    {detail_times.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mx={1}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.temperature_times),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">调温次数</Typography>
                {temperature_times !== undefined &&
                temperature_times !== null ? (
                  <Typography variant="h4">
                    {temperature_times.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mx={1}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.mode_times),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">调风次数</Typography>
                {mode_times !== undefined && mode_times !== null ? (
                  <Typography variant="h4">
                    {mode_times.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mx={1}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: details.map((detail) => detail.roomNumber),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: details.map((detail) => detail.request_time),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </React.Fragment>
              }
            >
              <Item>
                <Typography variant="subtitle1">请求时长</Typography>
                {request_time !== undefined && request_time !== null ? (
                  <Typography variant="h4">
                    {request_time.toLocaleString()}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No data
                  </Typography>
                )}
              </Item>
            </HtmlTooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitorNumbers;
