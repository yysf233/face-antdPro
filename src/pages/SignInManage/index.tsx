/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, DatePicker, message, Row, Select, Space, Tabs, Tag, Button } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '@/services/user/api';
import { getSignInInfoList, getUserSignInInfo } from '@/services/signIn/api';
import { useState } from 'react';
import { DataType } from '@antv/l7-core';
import moment from 'moment';

let timeout: any;
function fetch(value: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  async function fake() {
    const obj = {
      page: 1,
      size: 20,
      name: value,
    };
    await getUsers(obj).then((res: any) => callback(res.data));
  }
  timeout = setTimeout(fake, 300);
}

const UserManage: React.FC = () => {
  type UserInfoItem = {
    id: number;
    name: string;
    phoneNumber: string;
  };
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [tabKey, setTabKey] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(-1);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState('3');
  const [dataObj, setDataObj] = useState({});

  const columns: ProColumns<UserInfoItem>[] = [
    {
      title: '序号',
      width: 50,
      valueType: 'indexBorder',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
  ];
  const expandedRowRender = (expand: any, record: any) => {
    return (
      <>
        <RangePicker
          onChange={(data, dataString: any) => {
            const start = Date.parse(new Date(dataString[0]));
            const end = Date.parse(new Date(dataString[1]));
            console.log(start, end);
            setStartTime(start);
            setEndTime(end);
            actionRef.current?.reload();
          }}
          style={{ margin: '0px 0 20px 40px' }}
          showTime
        />
        ,
        <ProTable
          request={async (params: any) => {
            const obj: any = {
              userId: expand.id,
              page: 1,
              size: 10,
              startTime,
              endTime,
            };
            if (obj.startTime == 0) {
              obj.startTime = undefined;
              obj.endTime = undefined;
            }
            obj.page = params.current;
            obj.size = params.pageSize;
            const res = await getSignInInfoList(obj);
            return Promise.resolve({
              data: res.data,
              success: true,
              total: res.total,
            });
          }}
          columns={[
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '时间',
              dataIndex: 'time',
              key: 'time',
              valueType: 'dateTime',
            },
            {
              title: '签到设备',
              dataIndex: 'deviceId',
              key: 'time',
              render: (text: any, record: any) => <Tag color="#999">{record.deviceId} 号</Tag>,
            },
            {
              title: '出入情况',
              dataIndex: 'isEnter',
              key: 'id',
              render: (text: any, record: any) =>
                record.isEnter ? (
                  <Tag color="#87d068">进门打卡</Tag>
                ) : (
                  <Tag color="#f50">出门打卡</Tag>
                ),
            },
            {
              title: '是否有效',
              dataIndex: 'isValid',
              key: 'id',
              render: (text: any, record: any) =>
                record.isValid ? <Tag color="#87d068">有效</Tag> : <Tag color="#f50">无效</Tag>,
            },
          ]}
          actionRef={actionRef}
          headerTitle={false}
          search={false}
          options={false}
          pagination={{
            pageSize: 10,
          }}
        />
      </>
    );
  };
  const handleSearch = (value: any) => {
    if (value) {
      fetch(value, (data: any) => {
        console.log('data', data);
        setData(data);
      });
    } else {
      console.log('data', data);
      setData(data);
    }
  };

  const actionRefs = useRef<ActionType>();
  const actionRef = useRef<ActionType>();
  const { TabPane } = Tabs;
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const weekFormat = 'YYYY-MM-DD';
  const options = data.map((d: any) => (
    <Option key={d.id}>
      {d.name}-{d.phoneNumber}
    </Option>
  ));

  return (
    <PageContainer>
      <Card>
        <Tabs
          type="card"
          defaultActiveKey="1"
          onChange={(value) => {
            setTabKey(value);
          }}
        >
          <TabPane tab="签到信息查询" key="1">
            <ProTable
              expandable={{ expandedRowRender }}
              columns={columns}
              actionRef={actionRefs}
              request={async (params) => {
                const obj: { page: number | undefined; size: number | undefined } = {
                  page: params.current,
                  size: params.pageSize,
                };
                const res = await getUsers(obj);
                if (res.code == 200) {
                  return Promise.resolve({
                    data: res.data,
                    total: res.total,
                    success: true,
                  });
                } else {
                  message.warn(res.msg);
                  return Promise.resolve({
                    success: false,
                  });
                }
              }}
              toolBarRender={false}
              search={false}
              columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
              }}
              rowKey="id"
              pagination={{
                pageSize: 10,
              }}
              dateFormatter="string"
            />
          </TabPane>
          <TabPane tab="签到时长统计" key="2">
            <div key="user-select" style={{ margin: '0 0 12px 0' }}>
              <span style={{ lineHeight: '32px' }}>
                <Row gutter={8}>
                  <Col span={2}>
                    <label>
                      <span>选择用户</span>
                    </label>
                  </Col>
                  <Col span={18}>
                    <Select
                      showSearch
                      style={{ width: 300 }}
                      placeholder="请输入用户进行搜索"
                      onChange={(value: number) => {
                        setSelectedUserId(value);
                      }}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={(value) => {
                        console.log('changeValue', value);
                        handleSearch(value);
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                </Row>
              </span>
            </div>
            <div key="type-select" style={{ margin: '0 0 12px 0' }}>
              <span style={{ lineHeight: '32px' }}>
                <Row gutter={8}>
                  <Col span={2}>
                    <label>
                      <span>选择统计方式</span>
                    </label>
                  </Col>
                  <Col span={18}>
                    <Select
                      defaultValue="3"
                      onChange={(key: any) => {
                        setDataType(key);
                      }}
                    >
                      <Option value="1">日统计</Option>
                      <Option value="2">周统计</Option>
                      <Option value="3">月统计</Option>
                    </Select>
                  </Col>
                </Row>
              </span>
            </div>
            {dataType == '1' ? (
              <div style={{ margin: '0 0 12px 0' }}>
                <span style={{ lineHeight: '32px' }}>
                  <Row gutter={8}>
                    <Col span={2}>
                      <label>
                        <span>选择日期</span>
                      </label>
                    </Col>
                    <Col span={18}>
                      <DatePicker
                        onChange={(value, dataString) => {
                          const d = new Date(dataString);
                          const start = d.getTime() - 3600000 * 8;
                          const end = d.getTime() + 3600000 * 16 - 1;
                          setStartTime(start);
                          setEndTime(end);
                        }}
                      />
                    </Col>
                  </Row>
                </span>
              </div>
            ) : dataType == '2' ? (
              <div style={{ margin: '0 0 12px 0' }}>
                <span style={{ lineHeight: '32px' }}>
                  <Row gutter={8}>
                    <Col span={2}>
                      <label>
                        <span>选择周</span>
                      </label>
                    </Col>
                    <Col span={18}>
                      <DatePicker
                        onChange={(value, dataString) => {
                          const date: any = dataString.split(' ~ ');
                          const f = new Date(date[0]);
                          const s = new Date(date[1]);

                          const start = f.getTime() - 3600000 * 8;
                          const end = s.getTime() + 3600000 * 16 - 1;
                          setStartTime(start);
                          setEndTime(end);
                          console.log(start, end);
                        }}
                        defaultValue={moment()}
                        format={(value) =>
                          `${moment(value).startOf('week').format(weekFormat)} ~ ${moment(value)
                            .endOf('week')
                            .format(weekFormat)}`
                        }
                        picker="week"
                      />
                    </Col>
                  </Row>
                </span>
              </div>
            ) : (
              <div style={{ margin: '0 0 12px 0' }}>
                <span style={{ lineHeight: '32px' }}>
                  <Row gutter={8}>
                    <Col span={2}>
                      <label>
                        <span>选择月份</span>
                      </label>
                    </Col>
                    <Col span={18}>
                      <DatePicker
                        onChange={(value, dataString) => {
                          console.log(dataString);
                          const str: any = dataString.split('-');
                          const f = parseInt(str[0]);
                          const s = parseInt(str[1]);
                          const number = new Date(f, s, 0).getDate();
                          const start = new Date(dataString + '-01').getTime() - 3600000 * 8;
                          const end =
                            new Date(dataString + '-' + number).getTime() + 3600000 * 16 - 1;
                          setStartTime(start);
                          setEndTime(end);
                          console.log(start, end);
                        }}
                        picker="month"
                      />
                    </Col>
                  </Row>
                </span>
              </div>
            )}
            <Button
              type="primary"
              onClick={async () => {
                if (selectedUserId === -1) {
                  message.error('请选择用户！');
                  return;
                }
                const params = {
                  startTime,
                  endTime,
                  granularity: dataType,
                  userId: selectedUserId,
                };
                const res = await getUserSignInInfo(params);
                console.log(res);
                if (res.code == 200) {
                  setDataObj(res.data);
                } else {
                  message.error(res.msg);
                }
              }}
              style={{ margin: '0 0 0 100px' }}
            >
              查询
            </Button>
            {dataObj.detail ? (
              <Card title="签到信息统计" style={{ width: '400px', margin: '20px 0 0 0' }}>
                <p>
                  未签到天数： <span style={{ color: '999' }}>{dataObj.zeroDay}</span> 天
                </p>
                <p>
                  平均时长： <span style={{ color: '999' }}>{dataObj.avg}</span> 分钟
                </p>
                <p>
                  最长时长： <span style={{ color: '999' }}>{dataObj.max}</span> 分钟
                </p>
                <p>
                  最短时长： <span style={{ color: '999' }}>{dataObj.min}</span> 分钟
                </p>
                <p>
                  签到次数： <span style={{ color: '999' }}>{dataObj.detail.length}</span> 分钟
                </p>
                <p>
                  总时间：
                  <span style={{ color: '999' }}>
                    {
                      (dataObj.detail.forEach((item, index) => {
                        if (index == 0) {
                        } else {
                          dataObj.detail[0] = dataObj.detail[0] + item;
                        }
                      }),
                      dataObj.detail[0])
                    }
                  </span>
                  分钟
                </p>
              </Card>
            ) : (
              ''
            )}
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default UserManage;
