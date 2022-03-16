import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import TableBasic from './TableBasic';

const UserManage: React.FC = () => {
  return (
    <PageContainer>
      <TableBasic />
      <Card>11111</Card>
    </PageContainer>
  );
};

export default UserManage;
