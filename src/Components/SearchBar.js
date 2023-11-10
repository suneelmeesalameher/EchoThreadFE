import React, { useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin, Space } from 'antd';
import {SearchOutlined, UserAddOutlined} from '@ant-design/icons'

import { server_url } from '../config';

const {Option} = Select



function DebounceSelect({ fetchOptions, debounceTimeout = 300, onSelectUser, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      if(value){
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          const optionList = (newOptions || []).map(item=>{
            console.log(item)
            const jsxOption=(
              <Option value={item.value} label={item.label} key={item.value}>
                <Space>
                  <span className='username'>{item.label}</span>
                  <span><UserAddOutlined onClick={()=>{onSelectUser(item)}}/></span>
                </Space>
              </Option>)
              return jsxOption
          })
          setOptions(optionList);
          setFetching(false);
        });
        setOptions([])
      }
      setOptions([])
     
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch={true}
      suffixIcon={<SearchOutlined />}
      values={[]}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      //options={options}
    >
      {options}
    </Select>
  );
}

// Usage of DebounceSelect

async function fetchUserList(username) {
  return fetch(server_url+ '/' + username)
    .then((response) => response.json())
    .then((body) =>
      body.map((user) => ({
        label: `${user.emailId}`,
        value: user.userId,
        rsaKey: user.rsaKey
      })),
    );
}

const SearchBar = ({onSelectUser, ...props}) => {
  const [value, setValue] = useState({});
  return (
    <DebounceSelect
      //mode="single"
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      onSelectUser={onSelectUser}
      style={{
        width: '90%',
      }}
    />
  );
};
export default SearchBar;