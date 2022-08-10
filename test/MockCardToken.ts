import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "@ethersproject/units";
describe("MockCardToken", function () {
  async function setupToken() {
    const [owner, otherAccount] = await ethers.getSigners();
    const MockCardToken = await ethers.getContractFactory("MockCardToken");
    const token = await MockCardToken.deploy("Card Test Token", "CARD");

    return { token, owner, otherAccount };
  }

  it("Is a regular ERC20 token", async function () {
    const { token, owner, otherAccount } = await loadFixture(setupToken);

    expect(await token.name()).to.eq("Card Test Token");
    expect(await token.symbol()).to.eq("CARD");

    await token.mint(await otherAccount.getAddress(), parseEther("100"));

    expect(await token.balanceOf(await otherAccount.getAddress())).to.eq(
      parseEther("100")
    );

    await token
      .connect(otherAccount)
      .transfer(await owner.getAddress(), parseEther("50"));

    expect(await token.balanceOf(await otherAccount.getAddress())).to.eq(
      parseEther("50")
    );
    expect(await token.balanceOf(await owner.getAddress())).to.eq(
      parseEther("50")
    );
    await token.approve(await otherAccount.getAddress(), parseEther("50"));

    expect(await token.balanceOf(await otherAccount.getAddress())).to.eq(
      parseEther("50")
    );
    expect(await token.balanceOf(await owner.getAddress())).to.eq(
      parseEther("50")
    );
    await token
      .connect(otherAccount)
      .transferFrom(
        await owner.getAddress(),
        await otherAccount.getAddress(),
        parseEther("50")
      );
    expect(await token.balanceOf(await otherAccount.getAddress())).to.eq(
      parseEther("100")
    );
    expect(await token.balanceOf(await owner.getAddress())).to.eq(
      parseEther("0")
    );
  });

  it("reverts when attempting to set approval if approval already exists", async () => {
    const { token, otherAccount } = await loadFixture(setupToken);
    await token.approve(await otherAccount.getAddress(), parseEther("50"));
    await expect(
      token.approve(await otherAccount.getAddress(), parseEther("100"))
    ).to.be.rejected;
    await token.approve(await otherAccount.getAddress(), parseEther("0"));
    await token.approve(await otherAccount.getAddress(), parseEther("50"));
    await expect(
      token.approve(await otherAccount.getAddress(), parseEther("50"))
    ).to.be.rejected;
  });
  it("has increaseApproval method", async () => {
    const { token, owner, otherAccount } = await loadFixture(setupToken);
    await token.approve(await otherAccount.getAddress(), parseEther("50"));
    await token.increaseApproval(
      await otherAccount.getAddress(),
      parseEther("100")
    );
    expect(
      await token.allowance(
        await owner.getAddress(),
        await otherAccount.getAddress()
      )
    ).to.eq(parseEther("150"));
  });
  it("has decreaseApproval method", async () => {
    const { token, owner, otherAccount } = await loadFixture(setupToken);
    await token.approve(await otherAccount.getAddress(), parseEther("50"));
    await token.decreaseApproval(
      await otherAccount.getAddress(),
      parseEther("20")
    );
    expect(
      await token.allowance(
        await owner.getAddress(),
        await otherAccount.getAddress()
      )
    ).to.eq(parseEther("30"));
  });

  it("reverts on unsupported methods", async () => {
    const { token, owner } = await loadFixture(setupToken);
    await expect(
      token.increaseAllowance(await owner.getAddress(), parseEther("10"))
    ).to.be.rejectedWith("Not supported");
    await expect(
      token.decreaseAllowance(await owner.getAddress(), parseEther("10"))
    ).to.be.rejectedWith("Not supported");
  });
});
