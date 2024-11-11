import React from 'react';
import { Typography, Collapse } from 'antd';
import { FaHome, FaFacebookF, FaLinkedin } from 'react-icons/fa';
import { TwitterOutlined, InstagramOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Panel } = Collapse;

const Footer = () => {
  return (
    <div className="footer-container" style={{ backgroundColor: '#EEEEEE' }}>
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-5 gap-12 mt-4 mr-0 justify-items-center" >

        <div className="flex flex-col items-center justify-center">
          <FaHome style={{ color: '#006845', fontSize: '1.5rem', marginBottom: '0.5rem' }} />
          <Title level={3} className="mb-0 tracking-wide text-center" style={{ fontWeight: '700', color: '#006845' }}>
            UniNest
          </Title>
        </div>

        {}
        <div className="tracking-wide text-center md:hidden w-full">
          <Collapse accordion>
            <Panel header={<span className="font-bold">SELL A HOME</span>} key="1">
              <ul className="tracking-wide">
                <li className="mb-2 pt-4">Request an offer</li>
                <li className="mb-2">Pricing</li>
                <li className="mb-2">Reviews</li>
                <li className="mb-2">Stories</li>
              </ul>
            </Panel>
            <Panel header={<span className="font-bold">BUY A HOME</span>} key="2">
              <ul className="tracking-wide">
                <li className="mb-2 pt-4">Buy</li>
                <li className="mb-2">Finance</li>
              </ul>
            </Panel>
            <Panel header={<span className="font-bold">BUY, RENT AND SELL</span>} key="3">
              <ul className="tracking-wide">
                <li className="pt-4 mb-2">Buy and sell properties</li>
                <li className="mb-2">Rent home</li>
                <li className="mb-2">Builder trade-up</li>
              </ul>
            </Panel>
            <Panel header={<span className="font-bold">TERMS & PRIVACY</span>} key="4">
              <ul className="tracking-wide">
                <li className="pt-4 mb-2">Trust & Safety</li>
                <li className="mb-2">Terms of Service</li>
                <li className="mb-2">Privacy Policy</li>
              </ul>
            </Panel>
            <Panel header={<span className="font-bold">ABOUT</span>} key="5">
              <ul className="tracking-wide">
                <li className="pt-4 mb-2">Company</li>
                <li className="mb-2">How it works</li>
                <li className="mb-2">Contact</li>
                <li className="mb-2">Investors</li>
              </ul>
            </Panel>
            <Panel header={<span className="font-bold">RESOURCES</span>} key="6">
              <ul className="tracking-wide">
                <li className="pt-4 mb-2">Blog</li>
                <li className="mb-2">Guides</li>
                <li className="mb-2">FAQ</li>
                <li className="mb-2">Help Center</li>
              </ul>
            </Panel>
          </Collapse>
        </div>

        {}
        <div className="tracking-wide text-center hidden md:block">
          <Title level={5} className="mb-6 tracking-tight" style={{ fontWeight: '650' }}>SELL A HOME</Title>
          <ul className="tracking-wide">
            <li className="mb-2 pt-4">Request an offer</li>
            <li className="mb-2">Pricing</li>
            <li className="mb-2">Reviews</li>
            <li className="mb-2">Stories</li>
          </ul>
          <div className="mt-8 tracking-wide">
            <Title level={5} className="mb-4 tracking-tight" style={{ fontWeight: '650' }}>BUY A HOME</Title>
            <ul className="tracking-wide">
              <li className="mb-2 pt-4">Buy</li>
              <li className="mb-2">Finance</li>
            </ul>
          </div>
        </div>

        <div className="tracking-wide text-center hidden md:block">
          <Title level={5} className="mb-4 tracking-tight" style={{ fontWeight: '650' }}>BUY, RENT AND SELL</Title>
          <ul className="tracking-wide">
            <li className="pt-4 mb-2">Buy and sell properties</li>
            <li className="mb-2">Rent home</li>
            <li className="mb-2">Builder trade-up</li>
          </ul>
          <div className="mt-8 tracking-wide">
            <Title level={5} className="mb-4 tracking-tight" style={{ fontWeight: '650' }}>TERMS & PRIVACY</Title>
            <ul className="tracking-wide">
              <li className="pt-4 mb-2">Trust & Safety</li>
              <li className="mb-2">Terms of Service</li>
              <li className="mb-2">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="tracking-wide text-center hidden md:block">
          <Title level={5} className="mb-4 tracking-tight" style={{ fontWeight: '650' }}>ABOUT</Title>
          <ul className="tracking-wide">
            <li className="pt-4 mb-2">Company</li>
            <li className="mb-2">How it works</li>
            <li className="mb-2">Contact</li>
            <li className="mb-2">Investors</li>
          </ul>
          <div className="mt-8 tracking-wide">
            <Title level={5} className="mb-4 tracking-tight" style={{ fontWeight: '650' }}>RESOURCES</Title>
            <ul className="tracking-wide">
              <li className="pt-4 mb-2">Blog</li>
              <li className="mb-2">Guides</li>
              <li className="mb-2">FAQ</li>
              <li className="mb-2">Help Center</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#006845' }} className="text-footerText py-8 ">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm md:mr-auto mb-4 md:mb-0" style={{ color: '#A0C4A6' }}>©2021 UniNest. All rights reserved</span>
          <div className="flex space-x-12">
            <FaFacebookF style={{ color: '#A0C4A6', fontSize: '1.2rem' }} />
            <InstagramOutlined style={{ color: '#A0C4A6', fontSize: '1.2rem' }} />
            <TwitterOutlined style={{ color: '#A0C4A6', fontSize: '1.2rem' }} />
            <FaLinkedin style={{ color: '#A0C4A6', fontSize: '1.2rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
