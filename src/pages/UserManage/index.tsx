/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Button, Modal, Input, Popconfirm, message, Space } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { deleteUser, getUsers, regUser, updateUser } from '@/services/user/api';
import { useState } from 'react';
import { expect } from '@playwright/test';
import { deletePicById, getPicsById } from '@/services/pics/api';

const UserManage: React.FC = () => {
  const columns = [
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
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (text: any, record: { id: number; name: string; phoneNumber: string }) => [
        <Button
          type="primary"
          ghost
          key="link"
          onClick={() => {
            setEditId(record.id);
            setUpdateUserModalVisible(true);
          }}
        >
          更新用户
        </Button>,
        // eslint-disable-next-line react/jsx-key
        <Popconfirm
          title="确定要删除此用户吗？"
          onConfirm={async () => {
            const params = {
              id: record?.id,
            };
            const res = await deleteUser(params);
            if (res.data) {
              message.success(res.msg);
              actionRefs?.current.reload();
            } else {
              message.error('发生未知错误！');
            }
          }}
          onCancel={() => {}}
          okText="删除"
          cancelText="取消"
        >
          <Button type="primary" danger key="link2">
            删除用户
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  const expandedRowRender = (expand: any, record: any) => {
    console.log('expand', expand);
    
    return (
      <ProTable
        request={async () => {
          const obj = {
            id: expand.id,
          };
          const res = await getPicsById(obj);
          if (res.code == 200) {
            const arr: { image: string; }[] = [];
            res.data.map((item: string) => {
              const image = {
                image: 'http://121.196.237.209:8088/' + item,
                name: item
              };
              arr.push(image);
            });

            return Promise.resolve({
              data: arr,
              // total: res.total,
              success: true,
            });
          } else {
            message.warn(res.msg);
            return Promise.resolve({
              // data: res.data,
              // total: res.total,
              success: false,
            });
          }
        }}
        columns={[
          {
            title: '图片',
            dataIndex: 'image',
            key: 'image',
            valueType: 'image',
          },
          {
            title: '图片名称',
            dataIndex: 'name',
            key: 'name',
            // valueType: 'image',
          },
          {
            title: '操作',
            key: 'option',
            width: 120,
            valueType: 'option',
            render: (text: any, record: any) => [
              // eslint-disable-next-line react/jsx-key
              <Popconfirm
                title="确定要删除此图片吗？"
                onConfirm={async () => {
                  const params = {
                    name: record?.name,
                  };
                  const res = await deletePicById(params);
                  if (res.data) {
                    message.success(res.msg);
                    actionRef?.current.reload();
                  } else {
                    message.error('发生未知错误！');
                  }
                }}
                onCancel={() => {}}
                okText="删除"
                cancelText="取消"
              >
                <Button danger key="delete-user-pic">
                  删除图片
                </Button>
              </Popconfirm>,
            ],
          },
        ]}
        actionRef={actionRef}
        headerTitle={false}
        search={false}
        options={false}
        // dataSource={data}
        pagination={false}
      />
    );
  };

  const [updateUserModalVisible, setUpdateUserModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addedName, setAddedNewName] = useState('');
  const [addedphoneNumber, setAddedPhoneNumber] = useState('');
  const [editId, setEditId] = useState(0);

  const actionRefs = useRef<ActionType>();
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer
      header={{
        extra: [
          <Button
            type="primary"
            key="add-user-button"
            onClick={() => {
              setAddUserModalVisible(true);
            }}
          >
            添加用户
          </Button>,
        ],
      }}
    >
      <ProTable
        expandable={{ expandedRowRender }}
        columns={columns}
        actionRef={actionRefs}
        request={async (params) => {
          params.page = params.current;
          params.size = params.pageSize;
          params.current = undefined;
          params.pageSize = undefined;
          const res = await getUsers(params);
          if (res.code == 200) {
            return Promise.resolve({
              data: res.data,
              total: res.total,
              success: true,
            });
          } else {
            message.warn(res.msg);
            return Promise.resolve({
              // data: res.data,
              // total: res.total,
              success: false,
            });
          }
        }}
        editable={{
          type: 'multiple',
        }}
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
        headerTitle="用户列表"
      />
      {/* 更新人员对话框 */}
      <Modal
        title="更新人员信息"
        visible={updateUserModalVisible}
        onOk={async () => {
          const params = {
            id: editId,
            name: newName,
            phoneNumber: phoneNumber,
          };
          const res = await updateUser(params);
          if (res.code == 200) {
            message.success(res.msg);
          }
          setUpdateUserModalVisible(false);
          actionRefs?.current.reload();
          setNewName('');
          setPhoneNumber('');
        }}
        onCancel={() => {
          setUpdateUserModalVisible(false);
          setNewName('');
          setPhoneNumber('');
        }}
      >
        {/* 姓名 */}
        <div key="nameInput" style={{ margin: '0 0 12px 0' }}>
          <span>
            <Row gutter={8}>
              <Col span={3}>
                <label>
                  <span>姓名</span>
                </label>
              </Col>
              <Col span={18}>
                <Input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                  }}
                  placeholder="请输入新的姓名"
                />
              </Col>
            </Row>
          </span>
        </div>
        {/* 电话 */}
        <div key="phoneNameInput" style={{ margin: '0 0 12px 0' }}>
          <span>
            <Row gutter={8}>
              <Col span={3}>
                <label>
                  <span>电话</span>
                </label>
              </Col>
              <Col span={18}>
                <Input
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  placeholder="请输入新的电话号码"
                />
              </Col>
            </Row>
          </span>
        </div>
      </Modal>
      {/* 添加人员对话框 */}
      <Modal
        title="添加人员信息"
        visible={addUserModalVisible}
        onOk={async () => {
          const params = {
            id: 0,
            name: addedName,
            phoneNumber: addedphoneNumber,
          };
          const res = await regUser(params);
          if (res.code == 200) {
            message.success(res.msg);
          }
          setAddUserModalVisible(false);
          actionRefs?.current.reload();
          setAddedNewName('');
          setAddedPhoneNumber('');
        }}
        onCancel={() => {
          setAddUserModalVisible(false);
          setNewName('');
          setPhoneNumber('');
        }}
      >
        {/* 姓名 */}
        <div key="nameInput" style={{ margin: '0 0 12px 0' }}>
          <span>
            <Row gutter={8}>
              <Col span={3}>
                <label>
                  <span>姓名</span>
                </label>
              </Col>
              <Col span={18}>
                <Input
                  value={addedName}
                  onChange={(e) => {
                    setAddedNewName(e.target.value);
                  }}
                  placeholder="请输入新的姓名"
                />
              </Col>
            </Row>
          </span>
        </div>
        {/* 电话 */}
        <div key="phoneNameInput" style={{ margin: '0 0 12px 0' }}>
          <span>
            <Row gutter={8}>
              <Col span={3}>
                <label>
                  <span>电话</span>
                </label>
              </Col>
              <Col span={18}>
                <Input
                  maxLength={11}
                  value={addedphoneNumber}
                  onChange={(e) => {
                    setAddedPhoneNumber(e.target.value);
                  }}
                  placeholder="请输入新的电话号码"
                />
              </Col>
            </Row>
          </span>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default UserManage;
