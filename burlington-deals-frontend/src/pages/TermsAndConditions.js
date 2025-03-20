import React from 'react';
import { Box, Typography, Link, Paper, Container } from '@mui/material';
import { styled } from '@mui/system';
import { CheckCircleOutline as CheckCircle } from '@mui/icons-material';

const ModernPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[7],
    backgroundColor: theme.palette.grey[50], // Light, clean background
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
        backgroundColor: theme.palette.primary.main, // Accent color
    },
}));

const TermItem = styled(Typography)(({ theme }) => ({
    variant: 'body1',
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
}));

const Highlight = styled('span')(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.secondary.main, // Another accent color
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.dark,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const ListItem = styled('li')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    '&::marker': {
        color: theme.palette.primary.main,
    },
}));

const TermsAndConditions = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <ModernPaper>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary">
                    Burlington Deals - Your Agreement, Defined.
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Last Updated: January 1, 2025. By diving into Burlington Deals, you're agreeing to these terms. Let's keep it real.
                </Typography>

                <SectionTitle>1. Welcome to the Inner Circle</SectionTitle>
                <TermItem>
                    Hey there! By accessing or using Burlington Deals (the “Platform”), you (“you” or “User”) are entering into a legally binding agreement with us. These Terms of Use (“Terms”) govern your access to and use of the Platform. If you don't vibe with these Terms, please step away from the digital buffet. Your continued use means you're all in.
                </TermItem>

                <SectionTitle>2. What We Do: Connecting Foodies with Epic Deals</SectionTitle>
                <TermItem>
                    Burlington Deals is your go-to spot for discovering local restaurant deals in Burlington, Ontario. Think of us as the ultimate matchmaker between hungry folks and amazing offers. We host deals submitted by restaurant owners and the community, all in one place.
                </TermItem>

                <SectionTitle>3. Your Account: Keep it Locked Down</SectionTitle>
                <TermItem>
                    To unlock the full potential of Burlington Deals, you might need an account. It’s your responsibility to keep your login details confidential and secure. You’re the captain of your account, responsible for everything that happens under your username. Spot any unauthorized activity? Holler at us immediately.
                </TermItem>

                <SectionTitle>4. Your Content, Your Rules (Mostly)</SectionTitle>
                <TermItem>
                    You own the awesome deals, restaurant info, and other content you submit ("User Content"). However, by sharing it on Burlington Deals, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display your User Content on the Platform. This helps us, you know, show off your great finds!
                </TermItem>
                <TermItem>
                    Make sure your User Content is legit, accurate, and doesn't step on anyone else's rights. We have the right (but not the obligation) to remove any User Content that we deem inappropriate, offensive, or violating these Terms.
                </TermItem>

                <SectionTitle>5. Deal Accuracy: We're Just Spreading the Word</SectionTitle>
                <TermItem>
                    We work hard to keep the deals on Burlington Deals fresh and accurate. However, the deals are ultimately provided by restaurants and other users. Availability, prices, and terms can change faster than you can say "appetizer."
                </TermItem>
                <TermItem>
                    <Highlight>We don't guarantee the accuracy or reliability of any deal listed.</Highlight>  It's up to you to confirm the details with the restaurant before you order. We're not responsible if a deal isn't honored or if the fine print changes.
                </TermItem>

                <SectionTitle>6. Our Intellectual Playground: Respect the Sandbox</SectionTitle>
                <TermItem>
                    The Platform and its original content (excluding User Content), features, and functionality are owned by Burlington Deals and are protected by copyright, trademark, and other intellectual property laws. Don't go around copying our logos, designs, and code without our express permission.
                </TermItem>

                <SectionTitle>7. Keeping it Civil: Acceptable Use</SectionTitle>
                <TermItem>
                    Use Burlington Deals responsibly and ethically. Don't use the Platform to:
                    <ul>
                        <ListItem>Violate any laws or regulations.</ListItem>
                        <ListItem>Infringe on anyone's intellectual property rights.</ListItem>
                        <ListItem>Transmit any harmful, offensive, or illegal content.</ListItem>
                        <ListItem>Try to hack, disrupt, or mess with the Platform's security.</ListItem>
                        <ListItem>Collect or harvest any personally identifiable information without consent.</ListItem>
                    </ul>
                </TermItem>

                <SectionTitle>8. Wing Price Calculations:  A Little Math, A Little Assumption</SectionTitle>
                <TermItem>
                    Our wing price calculations are based on an assumption of approximately 9 wings per pound. However, this is just an estimate. Restaurants may have different wing sizes and serving styles, so the actual price per wing might vary. Use our calculations as a helpful guide, not the gospel truth.
                </TermItem>

                <SectionTitle>9. Disclaimer of Warranties:  We're Providing a Platform, Not a Promise</SectionTitle>
                <TermItem>
                    The Platform is provided on an “as is” and “as available” basis, without any warranties of any kind, either express or implied. We don’t guarantee that the Platform will be uninterrupted, secure, or error-free, or that any defects will be corrected. Basically, we’re doing our best, but we’re not making any promises.
                </TermItem>

                <SectionTitle>10. Limitation of Liability: Where Our Responsibility Ends</SectionTitle>
                <TermItem>
                    To the maximum extent permitted by applicable law, Burlington Deals and its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the Platform; (b) any conduct or content of any third party on the Platform; or (c) unauthorized access, use, or alteration of your transmissions or content.
                </TermItem>

                <SectionTitle>11. Indemnification: You've Got Our Back</SectionTitle>
                <TermItem>
                    You agree to indemnify, defend, and hold harmless Burlington Deals and its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees and costs, arising out of or in any way connected with your access to or use of the Platform, your User Content, or your breach of these Terms.
                </TermItem>

                <SectionTitle>12. Modifications and Termination: We Can Change Things Up</SectionTitle>
                <TermItem>
                    We reserve the right to modify or discontinue, temporarily or permanently, the Platform (or any part thereof) with or without notice. We may also modify these Terms at any time by posting the revised Terms on the Platform. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.
                </TermItem>
                <TermItem>
                    We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms.
                </TermItem>

                <SectionTitle>13. Governing Law: Ontario Rules</SectionTitle>
                <TermItem>
                    These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in Ontario, Canada for the resolution of any disputes arising out of or relating to these Terms or the Platform.
                </TermItem>

                <SectionTitle>14. Contact Us: We're All Ears</SectionTitle>
                <TermItem>
                    Got questions about these Terms?  Reach out to us at <StyledLink href="mailto:contact@burlingtondeals.ca">contact@burlingtondeals.ca</StyledLink>.
                </TermItem>
            </ModernPaper>
        </Container>
    );
};

export default TermsAndConditions;