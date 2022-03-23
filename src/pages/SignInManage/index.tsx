/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '@/services/user/api';
import { getPicsById } from '@/services/pics/api';

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
    // {
    //   title: '操作',
    //   key: 'id',
    //   width: 120,
    //   valueType: 'option',
    //   render: (text: any, record: { id: number; name: string; phoneNumber: string }) => [
    //     <Button
    //       type="primary"
    //       ghost
    //       key="link"
    //       onClick={() => {
    //         setEditId(record.id);
    //         setUpdateUserModalVisible(true);
    //       }}
    //     >
    //       更新用户
    //     </Button>,
    //     // eslint-disable-next-line react/jsx-key
    //     <Popconfirm
    //       title="确定要删除此用户吗？"
    //       onConfirm={async () => {
    //         const params = {
    //           id: record?.id,
    //         };
    //         const res = await deleteUser(params);
    //         if (res.data) {
    //           message.success(res.msg);
    //           actionRefs?.current.reload();
    //         } else {
    //           message.error('发生未知错误！');
    //         }
    //       }}
    //       onCancel={() => {}}
    //       okText="删除"
    //       cancelText="取消"
    //     >
    //       <Button type="primary" danger key="link2">
    //         删除用户
    //       </Button>
    //     </Popconfirm>,
    //   ],
    // },
  ];
  const expandedRowRender = (expand: any, record: any) => {
    return (
      <ProTable
        request={async () => {
          const obj = {
            id: expand.id,
          };
          const res = await getPicsById(obj);
          if (res.code == 200) {
            const arr: { image: string }[] = [];
            res.data.map((item: string) => {
              const image = {
                image: 'http://121.196.237.209:8088/' + item,
                name: item,
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
          // {
          //   title: '操作',
          //   key: 'option',
          //   width: 120,
          //   valueType: 'option',
          //   render: (text: any, record: any) => [
          //     // eslint-disable-next-line react/jsx-key
          //     <Popconfirm
          //       title="确定要删除此图片吗？"
          //       onConfirm={async () => {
          //         const params = {
          //           name: record?.name,
          //         };
          //         const res = await deletePicById(params);
          //         if (res.data) {
          //           message.success(res.msg);
          //           actionRef.current?.reload();
          //         } else {
          //           message.error('发生未知错误！');
          //         }
          //       }}
          //       onCancel={() => {}}
          //       okText="删除"
          //       cancelText="取消"
          //     >
          //       <Button danger key="delete-user-pic">
          //         删除图片
          //       </Button>
          //     </Popconfirm>,
          //   ],
          // },
        ]}
        actionRef={actionRef}
        headerTitle={false}
        search={false}
        options={false}
        pagination={{
          pageSize: 10,
        }}
        // dataSource={data}
        // pagination={false}
      />
    );
  };

  const actionRefs = useRef<ActionType>();
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer>
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
    </PageContainer>
  );
};

export default UserManage;
