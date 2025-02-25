// cronJobs.js
import cron from 'node-cron';
import Auction from '@models/Auction'; // Adjust the import based on your project structure
import Artwork from '@models/Artwork';

// Start scheduled auctions and stop ongoing auctions
const startCronJob = () => {
    // Schedule a job to run every minute
    cron.schedule('* * * * *', async () => {
        const currentTime = new Date();

        // Start auctions that are scheduled to start
        const auctionsToStart = await Auction.find({
            startTime: { $lte: currentTime },
            status: 'Scheduled'
        });

        for (const auction of auctionsToStart) {
            auction.status = 'Ongoing';
            
            const artwork = await Artwork.findById(auction.artwork);
        
            if (artwork) {
                artwork.onAuction = true;
                await artwork.save(); 
                console.log(`Artwork ${artwork.title} status set to on auction.`);
            } else {
                console.error(`Artwork not found for auction ${auction.title}`);
            }
        
            await auction.save();
            console.log(`Auction ${auction.title} started at ${currentTime}`);
        }
        

        const auctionsToEnd = await Auction.find({
            endTime: { $lte: currentTime },
            status: 'Ongoing'
        });

        for (const auction of auctionsToEnd) {
            auction.status = 'Completed';
            
            const artwork = await Artwork.findById(auction.artwork);
        
            if (artwork) {
                artwork.onAuction = false;
                await artwork.save();
                console.log(`Artwork ${artwork.title} status set to not on auction.`);
            } else {
                console.error(`Artwork not found for auction ${auction.title}`);
            }
        
            await auction.save();
            console.log(`Auction ${auction.title} ended at ${currentTime}`);
        }
        
    });
};

export default startCronJob;
