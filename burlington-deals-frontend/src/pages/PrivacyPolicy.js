import React from 'react';
import { Box, Typography, Link, Paper, Container } from '@mui/material';
import { styled } from '@mui/system';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const ModernPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[7],
    backgroundColor: theme.palette.grey[50],
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    variant: 'h4',
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '60px',
        height: '4px',
        backgroundColor: theme.palette.secondary.main,
    },
}));

const PolicyText = styled(Typography)(({ theme }) => ({
    variant: 'body1',
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
}));

const Highlight = styled('span')(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.primary.main,
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.dark,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <ModernPaper>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="secondary">
                    Burlington Deals - Your Privacy, Seriously.
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Last Updated: January 1, 2025. We're committed to protecting your personal information. Here's the lowdown on how we handle your data.
                </Typography>

                <SectionTitle>1. Your Data Journey with Us</SectionTitle>
                <PolicyText>
                    At Burlington Deals, we believe in transparency and control when it comes to your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform, available at <StyledLink href="https://burlingtondeals.ca" target="_blank" rel="noopener noreferrer">BurlingtonDeals.ca</StyledLink>.
                </PolicyText>

                <SectionTitle>2. The Information We Collect: What and Why</SectionTitle>
                <PolicyText>
                    We collect information to provide you with the best possible experience on Burlington Deals. Here’s a breakdown:
                    <Timeline position="alternate">
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="subtitle2">Account Information</Typography>
                                <Typography>When you register, we collect your email address and display name. This is essential for creating and managing your account.</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color="secondary" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="subtitle2">User-Generated Content</Typography>
                                <Typography>If you submit deals or restaurant information, we collect that content. This is how you contribute to the community!</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="subtitle2">Usage Data</Typography>
                                <Typography>We automatically collect information about your interactions with the platform, such as the pages you view, the deals you click on, and your search queries. This helps us improve the platform.</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color="secondary" />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="subtitle2">Device and Log Information</Typography>
                                <Typography>We collect information about your device (e.g., device type, operating system) and log information (e.g., IP address, access times). This helps us with security and troubleshooting.</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </PolicyText>

                <SectionTitle>3. How We Use Your Information: Making the Magic Happen</SectionTitle>
                <PolicyText>
                    Your information helps us to:
                    <ul>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Personalize your experience on Burlington Deals.</li>
                        <li>Communicate with you about your account and any updates.</li>
                        <li>Send you promotional materials (only if you've opted in!).</li>
                        <li>Analyze platform usage to make things better.</li>
                        <li>Detect, prevent, and address technical issues and security threats.</li>
                    </ul>
                </PolicyText>

                <SectionTitle>4. Cookies and Similar Tech:  The Digital Crumbs We Collect</SectionTitle>
                <PolicyText>
                    We use cookies and similar tracking technologies to analyze trends, administer the website, track users’ movements around the website, and to gather demographic information about our user base as a whole. You can control the use of cookies at the individual browser level, but if you choose to disable cookies, it may limit your use of certain features or functions on our website or service.
                </PolicyText>

                <SectionTitle>5. Sharing and Disclosure:  Who Sees What?</SectionTitle>
                <PolicyText>
                    We don't sell, trade, or rent your personal information to third parties. However, we may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving you (e.g., hosting providers, email marketing services). These providers are contractually obligated to keep your information confidential and secure.
                </PolicyText>
                <PolicyText>
                    We may also disclose your information if required by law, such as to comply with a subpoena or other legal process, or when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
                </PolicyText>

                <SectionTitle>6. Data Retention:  How Long We Keep It</SectionTitle>
                <PolicyText>
                    We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                </PolicyText>

                <SectionTitle>7. Security:  Keeping Your Data Safe and Sound</SectionTitle>
                <PolicyText>
                    We implement reasonable and appropriate security measures designed to protect your personal information from unauthorized access, use, alteration, and disclosure. These measures include encryption, firewalls, and secure server facilities. However, no method of transmission over the internet, or method of electronic storage, is 100% secure, and we cannot guarantee its absolute security.
                </PolicyText>

                <SectionTitle>8. Your Rights:  You're in Control</SectionTitle>
                <PolicyText>
                    You have certain rights regarding your personal information, including the right to:
                    <ul>
                        <li>Access the personal information we hold about you.</li>
                        <li>Request correction of any inaccurate or incomplete personal information.</li>
                        <li>Request erasure of your personal information under certain circumstances.</li>
                        <li>Object to the processing of your personal information.</li>
                        <li>Withdraw your consent at any time (where we rely on consent to process your data).</li>
                    </ul>
                    To exercise any of these rights, please contact us using the information provided below.
                </PolicyText>

                <SectionTitle>9. Children's Privacy:  Protecting the Little Ones</SectionTitle>
                <PolicyText>
                    Burlington Deals is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under age 13 without verification of parental consent, we take steps to remove that information from our servers.
                </PolicyText>

                <SectionTitle>10. International Data Transfers:  Keeping it Local (For Now)</SectionTitle>
                <PolicyText>
                    Currently, your personal information is primarily stored and processed within Canada. If in the future we transfer your information internationally, we will ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
                </PolicyText>

                <SectionTitle>11. Updates to This Policy:  Staying Current</SectionTitle>
                <PolicyText>
                    We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                </PolicyText>

                <SectionTitle>12. Contact Us:  Let's Connect</SectionTitle>
                <PolicyText>
                    If you have any questions or concerns about this Privacy Policy or our privacy practices, please don't hesitate to contact us at <StyledLink href="mailto:contact@burlingtondeals.ca">contact@burlingtondeals.ca</StyledLink>.
                </PolicyText>
            </ModernPaper>
        </Container>
    );
};

export default PrivacyPolicy;