import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Award, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Star,
  Clock,
  Thermometer,
  Droplets,
  Leaf,
  Zap
} from 'lucide-react';

const QualityContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 120px 20px 60px;
`;

const QualityContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const QualityHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const QualityTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const QualitySubtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const QualityCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QualityMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(motion.div)`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #059669;
    transform: translateY(-3px);
  }
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const MetricStatus = styled.div<{ status: 'excellent' | 'good' | 'warning' }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.5rem;
  
  ${props => {
    switch (props.status) {
      case 'excellent':
        return 'background: #dcfce7; color: #166534;';
      case 'good':
        return 'background: #fef3c7; color: #92400e;';
      case 'warning':
        return 'background: #fef2f2; color: #dc2626;';
      default:
        return 'background: #f1f5f9; color: #64748b;';
    }
  }}
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CertificationCard = styled(motion.div)`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #f59e0b;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(245, 158, 11, 0.2);
  }
`;

const CertificationIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CertificationTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

const CertificationDescription = styled.p`
  font-size: 0.875rem;
  color: #a16207;
  line-height: 1.5;
`;

const LabReportsSection = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

const ReportItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ReportInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReportIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ReportDetails = styled.div``;

const ReportTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ReportDate = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ReportStatus = styled.div<{ status: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.status === 'passed' ? '#059669' : '#dc2626'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

interface QualityMetric {
  id: number;
  name: string;
  value: string;
  unit: string;
  status: 'excellent' | 'good' | 'warning';
  icon: string;
  color: string;
}

const QualityAssurance: React.FC = () => {
  const [qualityMetrics] = useState<QualityMetric[]>([
    {
      id: 1,
      name: 'Bacterial Count',
      value: '< 10,000',
      unit: 'CFU/ml',
      status: 'excellent',
      icon: '🦠',
      color: '#059669'
    },
    {
      id: 2,
      name: 'Fat Content',
      value: '3.8%',
      unit: 'by weight',
      status: 'excellent',
      icon: '🥛',
      color: '#3b82f6'
    },
    {
      id: 3,
      name: 'Protein Content',
      value: '3.2%',
      unit: 'by weight',
      status: 'excellent',
      icon: '💪',
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'Temperature',
      value: '4°C',
      unit: 'maintained',
      status: 'excellent',
      icon: '🌡️',
      color: '#dc2626'
    },
    {
      id: 5,
      name: 'pH Level',
      value: '6.7',
      unit: 'pH',
      status: 'good',
      icon: '🧪',
      color: '#7c3aed'
    },
    {
      id: 6,
      name: 'Shelf Life',
      value: '7 days',
      unit: 'refrigerated',
      status: 'excellent',
      icon: '⏰',
      color: '#059669'
    }
  ]);

  const [certifications] = useState([
    {
      id: 1,
      title: 'FSSAI Certified',
      description: 'Food Safety and Standards Authority of India certification for safe food handling',
      icon: '🏛️'
    },
    {
      id: 2,
      title: 'Organic Certified',
      description: 'Certified organic by USDA and India Organic standards',
      icon: '🌱'
    },
    {
      id: 3,
      title: 'ISO 22000',
      description: 'International food safety management system certification',
      icon: '📋'
    },
    {
      id: 4,
      title: 'HACCP Certified',
      description: 'Hazard Analysis and Critical Control Points certification',
      icon: '🛡️'
    }
  ]);

  const [labReports] = useState([
    {
      id: 1,
      title: 'Microbiological Analysis',
      date: '2024-01-10',
      status: 'passed',
      icon: '🦠',
      color: '#059669'
    },
    {
      id: 2,
      title: 'Chemical Composition',
      date: '2024-01-08',
      status: 'passed',
      icon: '🧪',
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Pesticide Residue Test',
      date: '2024-01-05',
      status: 'passed',
      icon: '🌿',
      color: '#059669'
    },
    {
      id: 4,
      title: 'Heavy Metal Analysis',
      date: '2024-01-03',
      status: 'passed',
      icon: '⚗️',
      color: '#f59e0b'
    }
  ]);

  return (
    <QualityContainer>
      <QualityContent>
        <QualityHeader
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <QualityTitle>Quality Assurance</QualityTitle>
          <QualitySubtitle>
            Our commitment to delivering the highest quality dairy products through rigorous testing and certification
          </QualitySubtitle>
        </QualityHeader>

        <QualityGrid>
          <QualityCard
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SectionTitle>
              <Shield size={24} />
              Quality Metrics
            </SectionTitle>
            <QualityMetrics>
              {qualityMetrics.map((metric, index) => (
                <MetricCard
                  key={metric.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                >
                  <MetricIcon color={metric.color}>
                    {metric.icon}
                  </MetricIcon>
                  <MetricValue>{metric.value}</MetricValue>
                  <MetricLabel>{metric.name}</MetricLabel>
                  <MetricStatus status={metric.status}>
                    {metric.status.toUpperCase()}
                  </MetricStatus>
                </MetricCard>
              ))}
            </QualityMetrics>
          </QualityCard>

          <QualityCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SectionTitle>
              <Award size={24} />
              Certifications
            </SectionTitle>
            <CertificationsGrid>
              {certifications.map((cert, index) => (
                <CertificationCard
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                >
                  <CertificationIcon>{cert.icon}</CertificationIcon>
                  <CertificationTitle>{cert.title}</CertificationTitle>
                  <CertificationDescription>{cert.description}</CertificationDescription>
                </CertificationCard>
              ))}
            </CertificationsGrid>
          </QualityCard>
        </QualityGrid>

        <LabReportsSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>
            <FileText size={24} />
            Latest Lab Reports
          </SectionTitle>
          {labReports.map((report, index) => (
            <ReportItem key={report.id}>
              <ReportInfo>
                <ReportIcon color={report.color}>
                  {report.icon}
                </ReportIcon>
                <ReportDetails>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportDate>Tested on {report.date}</ReportDate>
                </ReportDetails>
              </ReportInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ReportStatus status={report.status}>
                  <CheckCircle size={16} />
                  {report.status.toUpperCase()}
                </ReportStatus>
                <ViewButton>View Report</ViewButton>
              </div>
            </ReportItem>
          ))}
        </LabReportsSection>
      </QualityContent>
    </QualityContainer>
  );
};

export default QualityAssurance; 