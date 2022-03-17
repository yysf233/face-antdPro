/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Button, Modal, Input, Popconfirm, message } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { deleteUser, getUsers } from '@/services/user/api';
import { useState } from 'react';

const UserManage: React.FC = () => {
  type UserTableItem = {
    id: number;
    name: string;
    phoneNumber: string;
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
    },
    {
      title: '操作',
      width: 100,
      key: 'option',
      valueType: 'option',
      render: (text, record) => [
        <Button
          type="primary"
          key="link"
          onClick={() => {
            setUpdateUserModalVisible(true);
          }}
        >
          更新用户
        </Button>,
        // eslint-disable-next-line react/jsx-key
        <Popconfirm
          title="确定要删除此用户吗？"
          onConfirm={async () => {
            console.log('record', record);
            const params = {
              id: record?.id,
            };
            console.log('actionRef',actionRef);
            
            const res = await deleteUser(params);

            if (res.data) {
              console.log('actionRef',actionRef);
              message.success(res.msg);
            }
            // eslint-disable-next-line no-param-reassign
            record = undefined;
          }}
          onCancel={() => {}}
          okText="删除"
          cancelText="取消"
        >
          <Button
            type="primary"
            danger
            key="link2"
            onClick={() => {
              setDeleteUserModalVisible(true);
            }}
          >
            删除用户
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const [updateUserModalVisible, setUpdateUserModalVisible] = useState(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer>
      <ProTable<UserTableItem>
        key={Math.random() * 10}
        columns={columns}
        actionRef={actionRef}
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
        rowKey={(record) => {
          // 加时间戳强制刷新
          return record.id + Date.now();
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="高级表格"
      />
      <Modal
        title="更新信息对话框"
        visible={updateUserModalVisible}
        onOk={() => {
          setUpdateUserModalVisible(false);
        }}
        onCancel={() => {
          setUpdateUserModalVisible(false);
        }}
      >
        <div>
          <span></span>
          <Input
            onChange={() => {
              e.pre;
            }}
          />
        </div>
      </Modal>
    </PageContainer>
  );
};

export default UserManage;
