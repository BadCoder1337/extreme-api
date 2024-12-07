import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TaskIcon from '@mui/icons-material/Task';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const SidebarData = [
    {
        title: 'Профиль',
        path: '/profile',
        // icon: <i className="bi bi-house"/>
        icon: <HomeRoundedIcon/>,
        id: 'profile',
    },
    {
        title: 'Расписание',
        path: '/schedule',
        // icon: <i className="bi bi-calendar-event"/>,
        icon: <DateRangeRoundedIcon/>,
        id: 'schedule',
    },
    {
        title: 'Мои задачи',
        path: '/tasks',
        // icon: <i className="bi bi-list-task"/>,
        icon: <FormatListBulletedRoundedIcon/>,
        id: 'tasks',
    },
    {
        title: 'Успеваемость',
        path: '/marks',
        // icon: <i className="bi bi-check-circle"/>,
        icon: <CheckCircleOutlineRoundedIcon/>,
        id: 'marks',
    },
    {
        title: 'Учебный план',
        path: '/curriculum',
        // icon: <i className="bi bi-card-checklist"/>,
        icon: <ChecklistIcon/>,
        id: 'curriculum',
    },
    {
        title: 'Курсы',
        path: '/courses',
        // icon: <i className="bi bi-mortarboard"/>,
        icon: <SchoolIcon/>,
        id: 'courses',
    },
    {
        title: 'Портфолио',
        path: '/portfolio',
        // icon: <i className="bi bi-briefcase"/>,
        icon: <BusinessCenterIcon/>,
        id: 'portfolio',
    },
    {
        title: 'Заказать справку',
        path: '/certificate',
        // icon: <i className="bi bi-file-earmark-text"/>,
        icon: <TaskIcon/>,
        id: 'certificate',
    },
    {
        title: 'Поиск',
        path: '/search',
        // icon: <i className="bi bi-search"/>,
        icon: <SearchIcon/>,
        id: 'search',
        // iconClosed: <i className="bi bi-arrow-down"/>,
        // iconOpened: <i className="bi bi-arrow-up"/>,
        iconClosed: <ArrowDownwardIcon/>,
        iconOpened: <ArrowUpwardIcon/>,

        subNav: [
            {
                title: 'Тест',
                path: '/profile/test',
                // icon: < />,
                id: 'test',
            },
        ]
    },
];