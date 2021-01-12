import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame } from 'types';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import { processData } from './util/process';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ x: string; y: number }>;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: [],
  };

  componentDidMount() {
    const series = this.props.data.series as Frame[];
    if (series.length == 0 || !this.props.options.flat_area) return;
    const data = processData(series, this.props.options.flat_area);
    this.setState({ data });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series != this.props.data.series) {
      const series = this.props.data.series as Frame[];
      if (series.length == 0 || !this.props.options.flat_area) return;
      const data = processData(series, this.props.options.flat_area);
      this.setState({ data });
    }
  }

  render() {
    const { width, height } = this.props;
    const { data } = this.state;
    if (data.length == 0) return <h4>No Data</h4>;

    return (
      <div
        style={{
          width,
          height,
          padding: 10,
        }}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={10}
          padding={10}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
        >
          <VictoryAxis style={{ tickLabels: { fontSize: 5, padding: 2 } }} />
          <VictoryBar
            horizontal
            data={data}
            labels={({ datum }) => `${datum.y}`}
            style={{ labels: { fill: '#444', fontSize: 5 } }}
            labelComponent={<VictoryLabel dx={10} />}
            // animate={{
            //   duration: 1000,
            //   onLoad: { duration: 500 },
            // }}
          />
        </VictoryChart>
      </div>
    );
  }
}
