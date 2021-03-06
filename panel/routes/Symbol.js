import { Component } from 'react';
import styled from 'styled-components';
import Data from '../symbol.json';
import Toc from '../toc.json';
import _ from 'lodash';
import { Title, Close, View, ListView, Cell } from '../components';

/// /////////////////////////////////////////////
// styled
/// /////////////////////////////////////////////

const Cover = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  background: rgba(100, 100, 100, 0.2);
  border-radius: 0.1rem;
  > img {
    max-width: 100%;
    max-height: 100%;
    zoom: 0.5;
  }
`;

const ImgTitle = styled.div`
  transition: all 0.2s ease-out;
  margin-top: 1rem;
  width: 100%;
  font-size: 0.7rem;
  text-align: center;
  color: #666;
`;

const Img = styled.div`
  display: block;
  margin-bottom: 3rem;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    transition: all 0.2s ease-out;
    zoom: 0.5;
    max-width: 100%;
    max-height: 6rem;
  }

  &:hover {
    ${ImgTitle} {
      color: #2b79ff;
    }
    img {
      transform: scale(1.05);
    }
  }

  &:active {
    img {
      transform: scale(0.95);
    }
  }
`;

const Library = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 14rem;
  padding: 1rem;
  background: #eee;
  overflow-y: auto;
`;

/// /////////////////////////////////////////////
// component
/// /////////////////////////////////////////////

class Symbol extends Component {
  state = {
    activeRoot: '导航类',
    activeGroup: '状态栏',
  };

  Cell = ({ toc, name, data }) => {
    const List = [];
    _.forEach(toc, value =>
      List.push(
        <Cell key={value} onClick={() => this.handleGroup(name, value)}>
          <Cover>
            <img src={data[value][0].png} />
          </Cover>
          <Cell.Title active={this.state.activeGroup === value}>{value}</Cell.Title>
        </Cell>
      )
    );
    return <Cell.Group>{List}</Cell.Group>;
  };

  Cells = ({ toc, data }) => {
    const List = [];
    _.forEach(toc, (value, key) =>
      List.push(
        <div key={key}>
          <Cell.Header>{key}</Cell.Header>
          <this.Cell toc={value} data={data[key]} name={key} />
        </div>
      )
    );
    return <ListView width="9rem">{List}</ListView>;
  };

  Library = ({ data }) => {
    const List = [];
    const SymbolData = data[this.state.activeRoot][this.state.activeGroup];
    const sortSymbol = (a, b) => parseInt(a.name.split('-')[0]) - parseInt(b.name.split('-')[0]);
    _.forEach(SymbolData.sort(sortSymbol), (value, key) =>
      List.push(
        <Img key={key} onDragEnd={() => window.postMessage('handleSymbol', JSON.stringify(value))}>
          <img src={value.png} />
          <ImgTitle>{value.name.split('-')[1]}</ImgTitle>
        </Img>
      )
    );
    return <Library>{List}</Library>;
  };

  render() {
    return [
      <Title key="title">组件库</Title>,
      <View key="panel" width={this.props.width} inner>
        <this.Cells key="cells" toc={Toc} data={Data} />
        <this.Library key="library" data={Data} />
        <Close name="symbol" />
      </View>,
    ];
  }

  handleGroup = (activeRoot, activeGroup) => {
    this.setState({ activeRoot, activeGroup });
  };
}

export default Symbol;
